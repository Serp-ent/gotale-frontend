"use client";

import React, { useCallback, useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
  BackgroundVariant,
  Panel,
  useReactFlow,
  DefaultEdgeOptions,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import StepNode, { StepNodeData } from './StepNode';
import { Button } from '@/components/ui/button';
import { ScenariosApi, Configuration, StepCreate, ChoiceCreate, LocationWrite } from '@/lib/api';
import { axiosInstance, useAuth } from '@/app/components/auth-provider';
import { Plus, Save, MousePointerClick, ChevronRight, Settings2, LayoutDashboard, X, Check, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import dagre from 'dagre';
import { toast } from 'sonner';

// Reusable Auto-resize Textarea component
function AutoResizeTextarea({ 
    value, 
    onChange, 
    placeholder, 
    className 
}: { 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
    placeholder?: string;
    className?: string;
}) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [value, adjustHeight]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
                onChange(e);
                adjustHeight();
            }}
            placeholder={placeholder}
            className={cn("resize-none overflow-hidden", className)}
            rows={1}
        />
    );
}

const apiConfig = new Configuration({
    basePath: 'http://localhost:8000',
});
const scenariosApi = new ScenariosApi(apiConfig, undefined, axiosInstance);

const nodeTypes = {
  step: StepNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { 
      strokeWidth: 2,
  },
  labelBgStyle: { 
      fill: 'hsl(var(--card))', 
      stroke: 'hsl(var(--border))',
      strokeWidth: 1,
      rx: 4, 
      ry: 4 
  },
  labelBgPadding: [8, 4] as [number, number],
  labelBgBorderRadius: 4,
  labelStyle: { 
      fill: 'hsl(var(--foreground))', 
      fontWeight: 600, 
      fontSize: 12,
      fontFamily: 'var(--font-sans)'
  },
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 400;
const nodeHeight = 250;
const rankSep = 200; 
const nodeSep = 150;

const EDGE_COLORS = [
    '#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6', '#EF4444', '#06B6D4', '#84CC16',
];

function CreatorFlow() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [isEditing, setIsEditing] = useState(false);
  
  const [scenarioTitle, setScenarioTitle] = React.useState("Nowy Scenariusz");
  const [scenarioDesc, setScenarioDesc] = React.useState("Opis twojej nowej przygody...");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingEdgeLabel, setEditingEdgeLabel] = useState("");

  const { getNodes, getEdges } = useReactFlow();

  const onNodeChangeData = useCallback((id: string, newData: Partial<StepNodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, ...newData },
            };
          }
          return node;
        })
      );
    }, []);

  const onDeleteStep = useCallback((id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, []);

  const onAddChild = useCallback((parentId: string) => {
      const nodes = getNodes();
      const edges = getEdges();
      const parentNode = nodes.find(n => n.id === parentId);
      if (!parentNode) return;

      const outgoingEdges = edges.filter(e => e.source === parentId);
      if (outgoingEdges.length >= 4) {
          toast.error("Osiągnięto limit wyjść");
          return;
      }

      const usedHandles = outgoingEdges.map(e => e.sourceHandle);
      let handleId = 'handle-0';
      for (let i = 0; i < 4; i++) {
          if (!usedHandles.includes(`handle-${i}`)) {
              handleId = `handle-${i}`;
              break;
          }
      }
      const handleIndex = parseInt(handleId.split('-')[1]);
      const newId = uuidv4();
      
      const newNode: Node<StepNodeData> = {
          id: newId,
          type: 'step',
          position: { x: parentNode.position.x, y: parentNode.position.y + 250 },
          data: {
              title: 'Nowa Opcja',
              description: '',
              onChange: onNodeChangeData,
              onAddChild: onAddChild,
              onDelete: onDeleteStep,
          },
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => addEdge({ 
          id: `e${parentId}-${newId}`, 
          source: parentId, 
          sourceHandle: handleId,
          target: newId, 
          targetHandle: `target-${handleIndex}`,
          label: 'Dalej',
          style: { stroke: EDGE_COLORS[handleIndex % EDGE_COLORS.length], strokeWidth: 2 }
      }, eds));
  }, [getNodes, getEdges, onNodeChangeData, onDeleteStep]);

  // Initial nodes
  const defaultNodes: Node<StepNodeData>[] = useMemo(() => [
    {
      id: uuidv4(),
      type: 'step',
      position: { x: 250, y: 50 },
      data: { 
          title: 'Start', 
          description: 'To jest początek twojej historii.', 
          onChange: onNodeChangeData,
          onAddChild: onAddChild,
          onDelete: (id) => onDeleteStep(id),
      },
    },
  ], [onNodeChangeData, onAddChild, onDeleteStep]);

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onLayout = useCallback(() => {
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: nodeSep, ranksep: rankSep });
    nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
    edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
    dagre.layout(dagreGraph);
    setNodes((nds) => nds.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 },
      };
    }));
  }, [nodes, edges, setNodes]);

  useEffect(() => {
      if (editId && !isLoaded) {
          const loadScenario = async () => {
              try {
                  const response = await scenariosApi.scenariosFullRetrieve(editId);
                  const scenario = response.data as any;
                  setIsEditing(true);
                  setScenarioTitle(scenario.title);
                  setScenarioDesc(scenario.description || "");
                  const loadedNodes: Node<StepNodeData>[] = [];
                  const loadedEdges: Edge[] = [];
                  scenario.steps?.forEach((step: any) => {
                      loadedNodes.push({
                          id: step.id,
                          type: 'step',
                          position: { x: 0, y: 0 },
                          data: {
                              title: step.title,
                              description: step.description || "",
                              location: step.location ? {
                                title: step.location.title,
                                description: step.location.description,
                                latitude: step.location.latitude,
                                longitude: step.location.longitude
                              } : null,
                              onChange: onNodeChangeData,
                              onAddChild: onAddChild,
                              onDelete: (id) => onDeleteStep(id),
                          }
                      });
                      step.choices?.forEach((choice: any, index: number) => {
                          const handleIndex = index % 4;
                          loadedEdges.push({
                              id: choice.id || uuidv4(),
                              source: step.id,
                              target: choice.next,
                              sourceHandle: `handle-${handleIndex}`,
                              targetHandle: `target-${handleIndex}`,
                              label: choice.text,
                              style: { stroke: EDGE_COLORS[handleIndex % EDGE_COLORS.length], strokeWidth: 2 }
                          });
                      });
                  });
                  setNodes(loadedNodes);
                  setEdges(loadedEdges);
                  setIsLoaded(true);
                  
                  // Auto layout
                  const graph = new dagre.graphlib.Graph();
                  graph.setGraph({ rankdir: 'TB', nodesep: nodeSep, ranksep: rankSep });
                  graph.setDefaultEdgeLabel(() => ({}));
                  loadedNodes.forEach(node => graph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
                  loadedEdges.forEach(edge => graph.setEdge(edge.source, edge.target));
                  dagre.layout(graph);
                  const laidOutNodes = loadedNodes.map(node => {
                      const pos = graph.node(node.id);
                      return { ...node, position: { x: pos.x - nodeWidth/2, y: pos.y - nodeHeight/2 } };
                  });
                  setNodes(laidOutNodes);
              } catch (error) {
                  console.error("Load failed", error);
                  toast.error("Błąd wczytywania scenariusza.");
              }
          };
          loadScenario();
      }
  }, [editId, isLoaded, onAddChild, onDeleteStep, onNodeChangeData, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => {
            if (eds.filter(e => e.source === params.source).length >= 4) {
                toast.error("Limit wyjść osiągnięty");
                return eds;
            }
            if (eds.some(e => e.source === params.source && e.sourceHandle === params.sourceHandle)) {
                toast.error("To wyjście jest już zajęte");
                return eds;
            }
            if (eds.some(e => e.target === params.target && e.targetHandle === params.targetHandle)) {
                toast.error("To wejście jest już zajęte");
                return eds;
            }
            const handleIndex = params.sourceHandle ? parseInt(params.sourceHandle.split('-')[1]) : 0;
            return addEdge({ 
                ...params, 
                label: 'Dalej',
                style: { stroke: EDGE_COLORS[handleIndex % EDGE_COLORS.length], strokeWidth: 2 }
            }, eds);
        });
    }, [setEdges]);

  const saveEdgeLabel = useCallback(() => {
      if (editingEdgeId) {
          if (!editingEdgeLabel || editingEdgeLabel.trim() === "") {
             setEdges((eds) => eds.filter((e) => e.id !== editingEdgeId));
          } else {
             setEdges((eds) => eds.map((e) => e.id === editingEdgeId ? { ...e, label: editingEdgeLabel } : e));
          }
          setEditingEdgeId(null);
      }
  }, [editingEdgeId, editingEdgeLabel, setEdges]);

  const saveScenario = async () => {
    const toastId = toast.loading("Zapisywanie...");
    setNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, errors: undefined } })));
    setGeneralError(null);
    try {
      const steps: StepCreate[] = nodes.map(node => {
        const choices: ChoiceCreate[] = edges.filter(e => e.source === node.id).map(edge => ({
            text: (edge.label as string) || 'Dalej', 
            next: edge.target
        }));
        return { id: node.id, title: node.data.title, description: node.data.description, choices, location: node.data.location || null };
      });
      const payload = { id: isEditing && editId ? editId : uuidv4(), created_by: user?.id || "", title: scenarioTitle, description: scenarioDesc, steps };
      if (isEditing && editId) {
          await scenariosApi.scenariosUpdate(editId, payload);
          toast.success('Zaktualizowano!', { id: toastId });
      } else {
          await scenariosApi.scenariosCreate(payload);
          toast.success('Zapisano!', { id: toastId });
      }
    } catch (error: any) {
      console.error("Save failed", error);
      toast.error("Błąd zapisu.", { id: toastId });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-slate-100 dark:bg-zinc-950 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={(e, edge) => { e.stopPropagation(); setEditingEdgeId(edge.id); setEditingEdgeLabel(edge.label as string || ""); }}
        onPaneClick={() => setEditingEdgeId(null)}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-100 dark:bg-zinc-950"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--muted-foreground)" className="opacity-25" />
        <Controls className="!bg-card !text-card-foreground !border-border" />
        
        {editingEdgeId && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-auto" onClick={() => setEditingEdgeId(null)}>
                <div className="bg-card text-card-foreground p-6 rounded-xl shadow-2xl border border-border w-96 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-accent"><Edit3 size={20} /><h3 className="font-bold text-lg">Edytuj wybór</h3></div>
                        <Button variant="destructive" size="icon" onClick={() => { setEdges(eds => eds.filter(e => e.id !== editingEdgeId)); setEditingEdgeId(null); }} className="bg-red-500 hover:bg-red-600 text-white -mr-2"><Trash2 size={18} /></Button>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-end"><label className="text-xs font-semibold text-muted-foreground uppercase">Tekst na połączeniu</label><span className={cn("text-[10px] font-mono", editingEdgeLabel.length >= 50 ? "text-destructive font-bold" : "text-muted-foreground")}>{editingEdgeLabel.length}/50</span></div>
                        <input className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent outline-none" value={editingEdgeLabel} onChange={e => setEditingEdgeLabel(e.target.value.replace(/\n/g, ''))} maxLength={50} autoFocus />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setEditingEdgeId(null)}>Anuluj</Button>
                        <Button onClick={saveEdgeLabel} className="bg-accent text-white">Zapisz</Button>
                    </div>
                </div>
            </div>
        )}

        <Panel position="top-right" className="m-4 pointer-events-none !top-[34px] !sm:top-[60px]">
            <div className={cn("pointer-events-auto bg-card/95 backdrop-blur-sm text-card-foreground rounded-xl shadow-xl border border-border/50 flex flex-col", isPanelOpen ? "w-80 p-6 max-h-[calc(100vh-6rem)] overflow-y-auto" : "w-12 p-2 items-center")}>
                <div className={cn("flex items-center gap-2 pb-2 border-b border-border w-full", !isPanelOpen && "border-none pb-0 justify-center")}>
                    {isPanelOpen && <><div className="w-2 h-6 bg-accent rounded-full shrink-0"></div><h2 className="font-bold text-lg">Szczegóły</h2></>}
                    <button onClick={() => setIsPanelOpen(!isPanelOpen)} className="ml-auto hover:bg-muted p-1 rounded-md">{isPanelOpen ? <ChevronRight size={18} /> : <Settings2 size={20} />}</button>
                </div>
                {isPanelOpen && (
                    <div className="space-y-4 mt-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-3">
                            <div className="space-y-1"><label className="text-xs font-semibold text-muted-foreground uppercase">Tytuł</label>
                                <input className="w-full p-2 rounded-md border bg-background/50 outline-none" value={scenarioTitle} onChange={e => setScenarioTitle(e.target.value.replace(/\n/g, ''))} maxLength={255} /></div>
                            <div className="space-y-1"><label className="text-xs font-semibold text-muted-foreground uppercase">Opis</label>
                                <AutoResizeTextarea className="w-full p-2 rounded-md border bg-background/50 outline-none text-sm min-h-[80px]" value={scenarioDesc} onChange={e => setScenarioDesc(e.target.value)} /></div>
                        </div>
                        <div className="pt-2 flex flex-col gap-2">
                            <Button onClick={saveScenario} className="w-full bg-accent text-white font-bold"><Save className="mr-2 h-4 w-4" /> {isEditing ? "Zaktualizuj" : "Zapisz"}</Button>
                            <Button onClick={onLayout} variant="secondary" className="w-full"><LayoutDashboard className="mr-2 h-4 w-4" /> Uporządkuj</Button>
                            <Button onClick={() => { const id = uuidv4(); setNodes(nds => nds.concat({ id, type: 'step', position: { x: Math.random()*400, y: Math.random()*400 }, data: { title: 'Nowy Krok', description: '', onChange: onNodeChangeData, onAddChild, onDelete: onDeleteStep } })); }} variant="outline" className="w-full border-dashed border-2 hover:border-accent"><Plus className="mr-2 h-4 w-4" /> Dodaj luźny krok</Button>
                        </div>
                    </div>
                )}
            </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Ładowanie...</div>}>
            <ReactFlowProvider>
                <CreatorFlow />
            </ReactFlowProvider>
        </Suspense>
    );
}