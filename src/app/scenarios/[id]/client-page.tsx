"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ScenariosApi, Configuration, Scenario } from '@/lib/api';
import { axiosInstance } from '@/app/components/auth-provider';
import { Loader2, User, Calendar, Clock, PlayCircle } from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ScenarioDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScenario = async () => {
      if (!id) return;
      try {
        const apiConfig = new Configuration({ basePath: 'http://localhost:8000' });
        const scenariosApi = new ScenariosApi(apiConfig, undefined, axiosInstance);
        const response = await scenariosApi.scenariosRetrieve(id);
        setScenario(response.data);
      } catch (error) {
        console.error("Failed to fetch scenario", error);
        toast.error("Nie udało się pobrać szczegółów scenariusza.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenario();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 p-4 flex justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="container mx-auto mt-20 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Scenariusz nie istnieje</h1>
        <Link href="/scenarios" className="text-accent hover:underline">Wróć do listy</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-4 max-w-4xl">
      <div className="bg-card text-card-foreground rounded-xl shadow-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-muted/30 p-8 border-b border-border">
            <h1 className="text-4xl font-bold mb-4">{scenario.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <Link href={`/user/${scenario.created_by.id}`} className="flex items-center hover:text-accent transition-colors">
                    <User size={16} className="mr-2" />
                    {scenario.created_by.username}
                </Link>
                <span className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Utworzono: {new Date(scenario.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    Zaktualizowano: {new Date(scenario.modified_at).toLocaleDateString()}
                </span>
            </div>
        </div>

        {/* Content */}
        <div className="p-8">
            <div className="prose dark:prose-invert max-w-none mb-8">
                <h3 className="text-xl font-semibold mb-2">Opis</h3>
                <p className="whitespace-pre-wrap">{scenario.description || "Brak opisu."}</p>
            </div>

            {scenario.root_step && (
                <div className="bg-accent/5 dark:bg-accent/10 p-6 rounded-lg border border-accent/20">
                    <h3 className="text-lg font-bold mb-2 flex items-center text-accent">
                        <PlayCircle className="mr-2" /> Początek historii
                    </h3>
                    <p className="italic text-muted-foreground mb-4">
                        "{scenario.root_step.title}"
                    </p>
                    <p className="mb-4">
                        {scenario.root_step.description}
                    </p>
                    {/* Placeholder for future "Play" functionality */}
                    <Button className="w-full sm:w-auto bg-accent text-white hover:bg-accent/90">
                        Rozpocznij przygodę
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
