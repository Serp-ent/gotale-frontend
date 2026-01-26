"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ScenariosApi, Configuration, Scenario } from '@/lib/api';
import { axiosInstance, useAuth } from '@/app/components/auth-provider';
import { Loader2, User, Calendar, Clock, Edit } from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ScenarioDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { token, user } = useAuth();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenario = async () => {
      if (!id) return;
      try {
        const apiConfig = new Configuration({ 
            basePath: 'http://localhost:8000',
            accessToken: token || undefined
        });
        const scenariosApi = new ScenariosApi(apiConfig, undefined, axiosInstance);
        // Use the new full retrieve endpoint
        const response = await scenariosApi.scenariosFullRetrieve(id);
        setScenario(response.data);
      } catch (error: any) {
        console.error("Failed to fetch scenario", error);
        const errorMsg = error.response?.data?.detail || error.message || "Unknown error";
        setError(errorMsg);
        toast.error("Nie udało się pobrać szczegółów scenariusza.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenario();
  }, [id, token]);

  const handleEditInCreator = () => {
      router.push(`/creator?edit=${id}`);
  };

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
        {error && (
            <div className="max-w-md mx-auto mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-left">
                <p className="font-bold text-destructive text-sm">Błąd debugowania:</p>
                <p className="text-xs font-mono text-muted-foreground break-all">ID: {id}</p>
                <p className="text-xs font-mono text-destructive mt-1">{error}</p>
            </div>
        )}
        <Link href="/scenarios" className="text-accent hover:underline">Wróć do listy</Link>
      </div>
    );
  }

  const canEdit = user && scenario.created_by && (
      (typeof scenario.created_by === 'string' && scenario.created_by === user.id) ||
      (typeof scenario.created_by === 'object' && 'id' in scenario.created_by && scenario.created_by.id === user.id)
  );

  return (
    <div className="container mx-auto mt-20 p-4 max-w-4xl">
      <div className="bg-card text-card-foreground rounded-xl shadow-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-muted/30 p-8 border-b border-border flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-4xl font-bold mb-4">{scenario.title}</h1>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    {scenario.created_by && (
                        <div className="flex items-center">
                            <User size={16} className="mr-2" />
                            {typeof scenario.created_by === 'object' && 'username' in scenario.created_by 
                                ? (scenario.created_by as any).username 
                                : 'Autor'}
                        </div>
                    )}
                    {scenario.created_at && (
                        <span className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Utworzono: {new Date(scenario.created_at).toLocaleDateString()}
                        </span>
                    )}
                    {scenario.modified_at && (
                        <span className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            Zaktualizowano: {new Date(scenario.modified_at).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
            
            {canEdit && (
                <Button onClick={handleEditInCreator} className="bg-accent text-white hover:bg-accent/90 shrink-0">
                    <Edit size={16} className="mr-2" />
                    Edytuj w Kreatorze
                </Button>
            )}
        </div>

        {/* Content */}
        <div className="p-8">
            <div className="prose dark:prose-invert max-w-none mb-8">
                <h3 className="text-xl font-semibold mb-2">Opis</h3>
                <p className="whitespace-pre-wrap">{scenario.description || "Brak opisu."}</p>
            </div>
        </div>
      </div>
    </div>
  );
}