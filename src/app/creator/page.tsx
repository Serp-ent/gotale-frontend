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
import { ScenariosApi, Configuration, StepCreate, ChoiceCreate } from '@/lib/api';
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

// Configure API Base URL
const apiConfig = new Configuration({
    basePath: 'http://localhost:8000',
});
// Use shared axios instance to handle 401s
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

// Vibrant colors for edges to make them distinguishable
const EDGE_COLORS = [
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Violet
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
];

function CreatorFlow() {
  const { setNodes: rfSetNodes, setEdges: rfSetEdges, getNodes, getEdges } = useReactFlow();
  const { user } = useAuth();
  const [scenarioTitle, setScenarioTitle] = React.useState("Nowy Scenariusz");
  const [scenarioDesc, setScenarioDesc] = React.useState("Opis twojej nowej przygody...");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
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

      // Find first available handle
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
          sourceHandle: handleId,
          target: newId, 
          targetHandle: `target-${handleIndex}`,
          label: 'Dalej',
          style: { stroke: EDGE_COLORS[handleIndex % EDGE_COLORS.length], strokeWidth: 2 }
      }, eds));

  }, [rfSetNodes, rfSetEdges, getNodes, getEdges, onNodeChangeData]);

  // Delete step handler
  const onDeleteStep = useCallback((id: string) => {
      rfSetNodes((nds) => nds.filter((node) => node.id !== id));
      rfSetEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
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
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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

        // Prevent multiple connections from the same handle
        if (outgoingEdges.some(e => e.sourceHandle === params.sourceHandle)) {
            toast.error("To wyjście jest już zajęte", {
                description: "Każdy punkt wyjścia może mieć tylko jedno połączenie."
            });
            return;
        }

        // Prevent multiple connections to the same target handle
        const incomingEdges = edges.filter(e => e.target === params.target && e.targetHandle === params.targetHandle);
        if (incomingEdges.length > 0) {
            toast.error("To wejście jest już zajęte", {
                description: "Każdy punkt wejścia może przyjąć tylko jedno połączenie."
            });
            return;
        }

        const handleIndex = params.sourceHandle ? parseInt(params.sourceHandle.split('-')[1]) : 0;

        setEdges((eds) => addEdge({ 
            ...params, 
            label: 'Dalej',
            style: { stroke: EDGE_COLORS[handleIndex % EDGE_COLORS.length], strokeWidth: 2 }
        }, eds));
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
          if (!editingEdgeLabel || editingEdgeLabel.trim() === "") {
             // If label is empty, delete the edge
             setEdges((eds) => eds.filter((e) => e.id !== editingEdgeId));
          } else {
             setEdges((eds) => eds.map((e) => {
                if (e.id === editingEdgeId) {
                    return { ...e, label: editingEdgeLabel };
                }
                return e;
             }));
          }
          setEditingEdgeId(null);
      }
  }, [editingEdgeId, editingEdgeLabel, setEdges]);

  const deleteEdge = useCallback(() => {
      if (editingEdgeId) {
          setEdges((eds) => eds.filter((e) => e.id !== editingEdgeId));
          setEditingEdgeId(null);
      }
  }, [editingEdgeId, setEdges]);

  const onLayout = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    dagreGraph.setGraph({ 
        rankdir: 'TB', 
        nodesep: nodeSep,
        ranksep: rankSep 
    });

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
  }, [setNodes, onNodeChangeData, onAddChild, onDeleteStep]);

  const clearErrors = useCallback(() => {
    rfSetNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, errors: undefined } })));
    setGeneralError(null);
  }, [rfSetNodes]);

  const saveScenario = async () => {
    const toastId = toast.loading("Zapisywanie scenariusza...");
    
    // Clear previous errors
    rfSetNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, errors: undefined } })));
    setGeneralError(null);

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
            location: node.data.location || null
        };
      });

      const payload = {
          id: uuidv4(),
          created_by: user?.id || "",
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
          const stepErrorsMap: Record<string, string[]> = {};
          const generalErrors: string[] = [];

          // Handle 'non_field_errors' (top-level errors)
          if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
              generalErrors.push(...data.non_field_errors);
          }

          // Handle 'steps' errors
          if (data.steps && typeof data.steps === 'object') {
             Object.entries(data.steps).forEach(([key, messages]: [string, any]) => {
                 const msgs = Array.isArray(messages) ? messages : [String(messages)];
                 
                 // Check if it's a nested non_field_error or similar
                 if (key === 'non_field_errors') {
                     generalErrors.push(...msgs);
                 } else {
                     stepErrorsMap[key] = msgs;
                 }
             });
          }

          // Handle generic detail error
          if (data.detail) {
              generalErrors.push(data.detail);
          }

          // If we found step errors, update nodes
          if (Object.keys(stepErrorsMap).length > 0) {
              errorMessage = "Błąd walidacji kroków";
              
              rfSetNodes((nds) => nds.map(n => {
                  if (stepErrorsMap[n.id]) {
                      return { ...n, data: { ...n.data, errors: stepErrorsMap[n.id] } };
                  }
                  return n;
              }));

              if (generalErrors.length === 0) {
                  errorDescription = "Błędy zostały zaznaczone na diagramie.";
              }
          }

          // If we have general errors, show them in description and set state
          if (generalErrors.length > 0) {
              errorDescription = generalErrors.join("\n");
              setGeneralError(errorDescription);
          } else if (Object.keys(stepErrorsMap).length === 0 && !data.detail) {
              // Fallback if structure is unknown but data exists
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
        defaultEdgeOptions={defaultEdgeOptions}
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-accent">
                            <Edit3 size={20} />
                            <h3 className="font-bold text-lg">Edytuj wybór</h3>
                        </div>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={deleteEdge}
                            className="bg-red-500 hover:bg-red-600 text-white -mr-2"
                            title="Usuń połączenie"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Tekst na połączeniu</label>
                            <span className={cn(
                                "text-[10px] font-mono",
                                editingEdgeLabel.length >= 50 ? "text-destructive font-bold" : "text-muted-foreground"
                            )}>
                                {editingEdgeLabel.length}/50
                            </span>
                        </div>
                        <input 
                            className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" 
                            value={editingEdgeLabel}
                            onChange={e => setEditingEdgeLabel(e.target.value.replace(/\n/g, ''))}
                            maxLength={50}
                            placeholder="Wpisz tekst lub zostaw puste aby usunąć"
                            autoFocus
                            onKeyDown={e => {
                                if (e.key === 'Enter') saveEdgeLabel();
                                if (e.key === 'Escape') setEditingEdgeId(null);
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setEditingEdgeId(null)} className="hover:bg-muted">
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
                isPanelOpen ? "w-80 p-6 max-h-[calc(100vh-6rem)] overflow-y-auto" : "w-12 p-2 items-center"
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
                                    onChange={e => setScenarioTitle(e.target.value.replace(/\n/g, ''))} 
                                    maxLength={255}
                                    placeholder="Epicka przygoda..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opis</label>
                                <AutoResizeTextarea 
                                    className="w-full p-2 rounded-md border bg-background/50 focus:bg-background transition-colors focus:ring-1 focus:ring-accent focus:border-accent outline-none text-sm min-h-[80px]" 
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
                            
                            {/* General Error Display */}
                            {generalError && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs font-medium animate-in slide-in-from-top-2">
                                    {generalError}
                                </div>
                            )}

                            {(nodes.some(n => n.data.errors && n.data.errors.length > 0) || generalError) && (
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
    const { isAuthenticated, isLoading, setShowLoginModal } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-slate-100 dark:bg-zinc-950 text-center px-4">
                 <div className="max-w-md space-y-4">
                    <h2 className="text-2xl font-bold">Wymagane logowanie</h2>
                    <p className="text-muted-foreground">Musisz być zalogowany, aby tworzyć scenariusze.</p>
                    <Button onClick={() => setShowLoginModal(true)} className="bg-accent text-white hover:bg-accent/90">
                        Zaloguj się
                    </Button>
                 </div>
            </div>
        );
    }

    return (
        <ReactFlowProvider>
            <CreatorFlow />
        </ReactFlowProvider>
    );
}
