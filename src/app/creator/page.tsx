"use client";

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  BackgroundVariant,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import StepNode, { StepNodeData } from './StepNode';
import { Button } from '@/components/ui/button';
import { ScenariosApi, Configuration, StepCreate, ChoiceCreate } from '@/lib/api';
import { axiosInstance } from '@/app/components/auth-provider';
import { Plus, Save, MousePointerClick, ChevronRight, Settings2, LayoutDashboard, X, Check, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import dagre from 'dagre';
import { toast } from 'sonner';

// Configure API Base URL
const apiConfig = new Configuration({
    basePath: 'http://localhost:8000',
});
// Use shared axios instance to handle 401s
const scenariosApi = new ScenariosApi(apiConfig, undefined, axiosInstance);

const nodeTypes = {
  step: StepNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 320;
const nodeHeight = 250;

function CreatorFlow() {
  const { setNodes: rfSetNodes, setEdges: rfSetEdges, getNodes, getEdges } = useReactFlow();
  const [scenarioTitle, setScenarioTitle] = React.useState("Nowy Scenariusz");
  const [scenarioDesc, setScenarioDesc] = React.useState("Opis twojej nowej przygody...");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  // State for edge editing
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingEdgeLabel, setEditingEdgeLabel] = useState("");

  // Handler for updating node data (title/description)
  const onNodeChangeData = useCallback((id: string, newData: Partial<StepNodeData>) => {
      rfSetNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        })
      );
    }, [rfSetNodes]);

  // Handler for adding a child node
  const onAddChild = useCallback((parentId: string) => {
      const parentNode = getNodes().find(n => n.id === parentId);
      if (!parentNode) return;

      // Validate outgoing edges count
      const edges = getEdges();
      const outgoingEdges = edges.filter(e => e.source === parentId);
      if (outgoingEdges.length >= 4) {
          toast.error("Osiągnięto limit wyjść", {
              description: "Możesz mieć maksymalnie 4 wyjścia z jednego kroku."
          });
          return;
      }

      const newId = uuidv4();
      const newNode: Node<StepNodeData> = {
          id: newId,
          type: 'step',
          position: {
              x: parentNode.position.x,
              y: parentNode.position.y + 250,
          },
          data: {
              title: 'Nowa Opcja',
              description: '',
              onChange: onNodeChangeData,
              onAddChild: onAddChild,
              onDelete: (id) => onDeleteStep(id),
          },
      };

      rfSetNodes((nds) => nds.concat(newNode));
      
      rfSetEdges((eds) => addEdge({ 
          id: `e${parentId}-${newId}`, 
          source: parentNode.id, 
          target: newId, 
          label: 'Dalej' 
      }, eds));

      toast.success("Dodano nowy krok");

  }, [rfSetNodes, rfSetEdges, getNodes, getEdges, onNodeChangeData]); // onDeleteStep added to deps below

  // Delete step handler
  const onDeleteStep = useCallback((id: string) => {
      rfSetNodes((nds) => nds.filter((node) => node.id !== id));
      rfSetEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
      toast.success("Usunięto krok");
  }, [rfSetNodes, rfSetEdges]);

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
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => {
        // Validate outgoing edges
        const edges = getEdges();
        const outgoingEdges = edges.filter(e => e.source === params.source);
        if (outgoingEdges.length >= 4) {
            toast.error("Limit wyjść osiągnięty", {
                description: "Ten węzeł ma już 4 połączenia wychodzące."
            });
            return;
        }
        setEdges((eds) => addEdge({ ...params, type: 'default', label: 'Dalej' }, eds));
        toast.success("Połączono kroki");
    },
    [setEdges, getEdges],
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation(); // Stop propagation to avoid clicking "behind"
      setEditingEdgeId(edge.id);
      setEditingEdgeLabel((edge.label as string) || "");
  }, []);

  const saveEdgeLabel = useCallback(() => {
      if (editingEdgeId) {
          setEdges((eds) => eds.map((e) => {
              if (e.id === editingEdgeId) {
                  return { ...e, label: editingEdgeLabel || "Dalej" };
              }
              return e;
          }));
          setEditingEdgeId(null);
          toast.success("Zaktualizowano wybór");
      }
  }, [editingEdgeId, editingEdgeLabel, setEdges]);

  const onLayout = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });

    rfSetNodes(layoutedNodes);
    toast.info("Układ zaktualizowany");
  }, [getNodes, getEdges, rfSetNodes]);

  // Add onDelete to dynamically added steps
  const addStep = useCallback(() => {
    const id = uuidv4();
    const newNode: Node<StepNodeData> = {
      id,
      type: 'step',
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        title: 'Nowy Krok',
        description: '',
        onChange: onNodeChangeData,
        onAddChild: onAddChild,
        onDelete: (id) => onDeleteStep(id),
      },
    };
    setNodes((nds) => nds.concat(newNode));
    toast.success("Dodano luźny krok");
  }, [setNodes, onNodeChangeData, onAddChild, onDeleteStep]);

  const clearErrors = useCallback(() => {
    rfSetNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, errors: undefined } })));
    toast.info("Wyczyszczono błędy");
  }, [rfSetNodes]);

  const saveScenario = async () => {
    const toastId = toast.loading("Zapisywanie scenariusza...");
    
    // Clear previous errors
    rfSetNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, errors: undefined } })));

    try {
      const edgesBySource = edges.reduce((acc, edge) => {
        if (!acc[edge.source]) acc[edge.source] = [];
        acc[edge.source].push(edge);
        return acc;
      }, {} as Record<string, Edge[]>);

      const steps: StepCreate[] = nodes.map(node => {
        const nodeEdges = edgesBySource[node.id] || [];
        const choices: ChoiceCreate[] = nodeEdges.map(edge => ({
            text: (edge.label as string) || 'Dalej', 
            next: edge.target
        }));

        return {
            id: node.id,
            title: node.data.title,
            description: node.data.description,
            choices: choices,
            location: null 
        };
      });

      const payload = {
          title: scenarioTitle,
          description: scenarioDesc,
          steps: steps,
      };

      console.log("Saving Scenario:", payload);
      await scenariosApi.scenariosCreate(payload);
      toast.success('Scenariusz zapisany pomyślnie!', { id: toastId });

    } catch (error: any) {
      console.error("Failed to save scenario", error);
      
      let errorMessage = "Nie udało się zapisać scenariusza.";
      let errorDescription = "Sprawdź połączenie z serwerem.";

      if (error.response && error.response.data) {
          const data = error.response.data;
          
          if (data.steps && typeof data.steps === 'object') {
              // Handle step-specific errors
              const stepErrors = Object.entries(data.steps).map(([stepId, messages]: [string, any]) => {
                  const node = nodes.find(n => n.id === stepId);
                  const nodeTitle = node ? `"${node.data.title}"` : "Nieznany krok";
                  const msgs = Array.isArray(messages) ? messages : [String(messages)];
                  
                  // Update node with errors
                  rfSetNodes((nds) => nds.map(n => {
                      if (n.id === stepId) {
                          return { ...n, data: { ...n.data, errors: msgs } };
                      }
                      return n;
                  }));

                  return `Krok ${nodeTitle}: ${msgs.join(", ")}`;
              });
              
              if (stepErrors.length > 0) {
                  errorMessage = "Błąd walidacji kroków";
                  errorDescription = "Błędy zostały zaznaczone na diagramie.";
              }
          } else if (data.detail) {
               errorDescription = data.detail;
          } else {
               // Fallback for other validation errors
               errorDescription = JSON.stringify(data);
          }
      }

      toast.error(errorMessage, { 
          id: toastId,
          description: errorDescription,
          duration: 5000
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-slate-100 dark:bg-zinc-950 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onPaneClick={() => setEditingEdgeId(null)} // Close dialog on click background
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-100 dark:bg-zinc-950"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--muted-foreground)" className="opacity-25" />
        <Controls className="!bg-card !text-card-foreground !border-border !shadow-md [&>button]:!border-border [&>button]:!bg-card [&>button]:!text-card-foreground [&>button:hover]:!bg-muted [&_svg]:!fill-current" />
        
        {/* Edge Edit Dialog Overlay */}
        {editingEdgeId && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-auto" onClick={() => setEditingEdgeId(null)}>
                <div 
                    className="bg-card text-card-foreground p-6 rounded-xl shadow-2xl border border-border w-96 animate-in zoom-in-95 duration-200 flex flex-col gap-4"
                    onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <div className="flex items-center gap-2 text-accent">
                        <Edit3 size={20} />
                        <h3 className="font-bold text-lg">Edytuj wybór</h3>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Tekst na połączeniu</label>
                        <input 
                            className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" 
                            value={editingEdgeLabel}
                            onChange={e => setEditingEdgeLabel(e.target.value)}
                            placeholder="np. 'Otwórz drzwi'"
                            autoFocus
                            onKeyDown={e => {
                                if (e.key === 'Enter') saveEdgeLabel();
                                if (e.key === 'Escape') setEditingEdgeId(null);
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setEditingEdgeId(null)} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
                            <X size={16} className="mr-1"/> Anuluj
                        </Button>
                        <Button onClick={saveEdgeLabel} className="bg-accent hover:bg-accent/90 text-white">
                            <Check size={16} className="mr-1"/> Zapisz
                        </Button>
                    </div>
                </div>
            </div>
        )}

        <Panel position="top-right" className="m-4 pointer-events-none !top-[34px] !sm:top-[60px]">
            <div className={cn(
                "pointer-events-auto bg-card/95 backdrop-blur-sm text-card-foreground rounded-xl shadow-xl border border-border/50 transition-all duration-300 overflow-hidden flex flex-col",
                isPanelOpen ? "w-80 p-6" : "w-12 p-2 items-center"
            )}>
                {/* Header / Toggle */}
                <div className={cn("flex items-center gap-2 pb-2 border-b border-border w-full", !isPanelOpen && "border-none pb-0 justify-center")}>
                    {isPanelOpen && (
                        <>
                            <div className="w-2 h-6 bg-accent rounded-full shrink-0"></div>
                            <h2 className="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">Szczegóły</h2>
                        </>
                    )}
                    <button 
                        onClick={() => setIsPanelOpen(!isPanelOpen)} 
                        className="ml-auto hover:bg-muted p-1 rounded-md transition-colors"
                        title={isPanelOpen ? "Zwiń" : "Rozwiń"}
                    >
                        {isPanelOpen ? <ChevronRight size={18} /> : <Settings2 size={20} />}
                    </button>
                </div>
                
                {isPanelOpen && (
                    <div className="space-y-4 mt-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tytuł</label>
                                <input 
                                    className="w-full p-2 rounded-md border bg-background/50 focus:bg-background transition-colors focus:ring-1 focus:ring-accent focus:border-accent outline-none font-medium" 
                                    value={scenarioTitle} 
                                    onChange={e => setScenarioTitle(e.target.value)} 
                                    placeholder="Epicka przygoda..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opis</label>
                                <textarea 
                                    className="w-full p-2 rounded-md border bg-background/50 focus:bg-background transition-colors focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm min-h-[80px] resize-none" 
                                    value={scenarioDesc} 
                                    onChange={e => setScenarioDesc(e.target.value)} 
                                    placeholder="O czym jest ta historia?"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <Button onClick={saveScenario} className="w-full bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/20 transition-all active:scale-95">
                                <Save className="mr-2 h-4 w-4" /> Zapisz Scenariusz
                            </Button>
                            <Button onClick={onLayout} variant="secondary" className="w-full hover:bg-secondary/80 transition-colors">
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Uporządkuj
                            </Button>
                            <Button onClick={addStep} variant="outline" className="w-full border-dashed border-2 hover:border-accent hover:bg-accent/10 hover:text-accent transition-colors">
                                <Plus className="mr-2 h-4 w-4" /> Dodaj luźny krok
                            </Button>
                            {nodes.some(n => n.data.errors && n.data.errors.length > 0) && (
                                <Button onClick={clearErrors} variant="outline" className="w-full border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-800 animate-in zoom-in-95 duration-300">
                                    <X className="mr-2 h-4 w-4" /> Wyczyść błędy
                                </Button>
                            )}
                        </div>

                        <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                            <h3 className="text-xs font-bold text-muted-foreground mb-2 flex items-center">
                                <MousePointerClick className="w-3 h-3 mr-1" /> Wskazówki
                            </h3>
                            <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-3">
                                <li>Najedź na węzeł i kliknij <span className="text-accent font-bold text-xs inline-block transform translate-y-[1px]">+</span> aby dodać powiązany krok.</li>
                                <li>Kliknij linię połączenia, aby zmienić nazwę wyboru.</li>
                                <li>Przeciągnij z dolnego punktu do górnego, aby połączyć ręcznie.</li>
                                <li><strong>Limit:</strong> Maksymalnie 4 wybory z jednego kroku.</li>
                            </ul>
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
        <ReactFlowProvider>
            <CreatorFlow />
        </ReactFlowProvider>
    );
}
