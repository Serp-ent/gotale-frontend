"use client";

import { useEffect, useState } from 'react';
import { ScenariosApi, Configuration, Scenario } from '@/lib/api';
import { axiosInstance } from '@/app/components/auth-provider';
import { Loader2, BookOpen, User } from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const apiConfig = new Configuration({ basePath: 'http://localhost:8000' });
        const scenariosApi = new ScenariosApi(apiConfig, undefined, axiosInstance);
        const response = await scenariosApi.scenariosList();
        setScenarios(response.data);
      } catch (error) {
        console.error("Failed to fetch scenarios", error);
        toast.error("Nie udało się pobrać listy scenariuszy.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  return (
    <div className="container mx-auto mt-20 p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
            <BookOpen className="mr-3" /> Wszystkie Scenariusze
        </h1>
        <Link 
            href="/creator" 
            className="bg-accent text-white px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
        >
            Stwórz własny
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-accent" size={48} />
        </div>
      ) : scenarios.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-border rounded-xl text-muted-foreground">
            Brak scenariuszy do wyświetlenia. Bądź pierwszy!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
                <div key={scenario.id} className="bg-card text-card-foreground p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-all flex flex-col h-full group">
                    <div className="flex-grow">
                        <Link href={`/scenarios/${scenario.id}`} className="block">
                            <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-accent transition-colors">{scenario.title}</h2>
                        </Link>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {scenario.description || "Brak opisu."}
                        </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
                        {scenario.created_by ? (
                            <Link 
                                href={`/user/${scenario.created_by.id}`} 
                                className="flex items-center text-accent hover:underline font-medium"
                            >
                                <User size={14} className="mr-1" />
                                {scenario.created_by.username}
                            </Link>
                        ) : (
                            <span className="text-muted-foreground italic">Anonim</span>
                        )}
                        <span className="text-muted-foreground text-xs">
                            {scenario.created_at ? new Date(scenario.created_at).toLocaleDateString() : ""}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
