import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { PlusCircle, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepNodeData = {
    title: string;
    description: string;
    onChange: (id: string, data: Partial<StepNodeData>) => void;
    onAddChild?: (parentId: string) => void;
    onDelete?: (id: string) => void;
    errors?: string[];
};

export default function StepNode({ id, data }: NodeProps<Node<StepNodeData>>) {
    const [showErrors, setShowErrors] = useState(false);
    const hasErrors = data.errors && data.errors.length > 0;

    const handleTitleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        data.onChange(id, { title: evt.target.value });
    }, [id, data]);

    const handleDescChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        data.onChange(id, { description: evt.target.value });
    }, [id, data]);

    const handleAddChild = useCallback((evt: React.MouseEvent) => {
        evt.stopPropagation();
        if (data.onAddChild) {
            data.onAddChild(id);
        }
    }, [id, data]);

    const handleDelete = useCallback((evt: React.MouseEvent) => {
        evt.stopPropagation();
        if (data.onDelete) {
            data.onDelete(id);
        }
    }, [id, data]);

    return (
        <div className={cn(
            "group relative bg-white dark:bg-zinc-900 text-card-foreground rounded-xl border-2 shadow-md dark:shadow-slate-900/50 min-w-[300px] transition-all duration-200",
            hasErrors 
                ? "border-red-500 shadow-red-500/20" 
                : "border-slate-200 dark:border-slate-700 hover:border-accent/50 focus-within:border-accent"
        )}>
             <Handle type="target" position={Position.Top} className="!bg-accent w-3 h-3 border-2 border-background" />
            
            {/* Delete Button */}
            <button
                onClick={handleDelete}
                className="absolute -top-3 -right-3 z-10 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-destructive/90"
                title="Usuń krok"
            >
                <Trash2 size={16} />
            </button>

            {/* Error Indicator */}
            {hasErrors && (
                <div 
                    className="absolute -top-3 -left-3 z-20 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setShowErrors(!showErrors); }}
                    onMouseEnter={() => setShowErrors(true)}
                    onMouseLeave={() => setShowErrors(false)}
                >
                    <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                        <AlertCircle size={20} />
                    </div>
                    
                    {/* Error Tooltip */}
                    {showErrors && (
                        <div className="absolute top-8 left-0 w-64 bg-red-50 dark:bg-red-950/90 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs p-2 rounded-md shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                            <ul className="list-disc pl-4 space-y-1">
                                {data.errors!.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}


            <div className="flex flex-col space-y-1.5 p-4 pb-2">
                <input 
                    value={data.title} 
                    onChange={handleTitleChange} 
                    placeholder="Tytuł kroku" 
                    className="nodrag flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-lg font-bold shadow-none transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-0"
                />
            </div>
            <div className="p-4 pt-2">
                <textarea 
                    value={data.description} 
                    onChange={(e) => {
                        handleDescChange(e);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }} 
                    rows={1}
                    placeholder="Opis kroku..." 
                    className="nodrag flex min-h-[80px] w-full rounded-md bg-muted/30 dark:bg-muted/10 px-3 py-2 text-sm shadow-none placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-0 resize-none overflow-hidden text-foreground"
                />
            </div>

            {/* Quick Add Button */}
            <button 
                onClick={handleAddChild}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 shadow-md z-10"
                title="Dodaj powiązany krok"
            >
                <PlusCircle size={20} />
            </button>

            <Handle type="source" position={Position.Bottom} className="!bg-accent w-3 h-3 border-2 border-background" />
        </div>
    );
}
