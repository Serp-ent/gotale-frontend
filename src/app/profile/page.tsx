"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth, axiosInstance } from "@/app/components/auth-provider";
import { UserCircle, Trash2, BookOpen, Loader2 } from "lucide-react";
import { ScenariosApi, Configuration, Scenario } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(true);

  const fetchScenarios = useCallback(async () => {
    if (!user) return;
    try {
        const apiConfig = new Configuration({ basePath: 'http://localhost:8000' });
        const scenariosApi = new ScenariosApi(apiConfig, undefined, axiosInstance);
        const response = await scenariosApi.scenariosList();
        // Client-side filtering for now
        const userScenarios = response.data.filter(s => s.created_by.id === user.id);
        setScenarios(userScenarios);
    } catch (error) {
        console.error("Failed to fetch scenarios", error);
        toast.error("Nie udało się pobrać scenariuszy.");
    } finally {
        setIsLoadingScenarios(false);
    }
  }, [user]);

  useEffect(() => {
      if (isAuthenticated) {
          fetchScenarios();
      }
  }, [isAuthenticated, fetchScenarios]);

  const handleDeleteScenario = async (id: string) => {
      try {
          const apiConfig = new Configuration({ basePath: 'http://localhost:8000' });
          const scenariosApi = new ScenariosApi(apiConfig, undefined, axiosInstance);
          await scenariosApi.scenariosDestroy(id);
          toast.success("Scenariusz usunięty.");
          setScenarios(prev => prev.filter(s => s.id !== id));
      } catch (error) {
          console.error("Failed to delete scenario", error);
          toast.error("Nie udało się usunąć scenariusza.");
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto mt-20 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Dostęp zabroniony</h1>
        <p>Musisz się zalogować, aby zobaczyć ten profil.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-4 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-md border border-border flex flex-col items-center h-fit md:col-span-1">
            <div className="bg-accent/10 p-4 rounded-full mb-4">
                <UserCircle size={64} className="text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-1 text-center break-all">{user?.username}</h1>
            <p className="text-muted-foreground mb-6 text-sm text-center break-all">{user?.email}</p>

            <div className="w-full space-y-3 text-left">
                <div className="p-3 bg-background rounded-lg border border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Imię</span>
                    <p className="text-sm font-medium">{user?.first_name || '-'}</p>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Nazwisko</span>
                    <p className="text-sm font-medium">{user?.last_name || '-'}</p>
                </div>
            </div>
        </div>

        {/* Scenarios List */}
        <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold flex items-center">
                <BookOpen className="mr-2" /> Twoje Scenariusze
            </h2>
            
            {isLoadingScenarios ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-accent" />
                </div>
            ) : scenarios.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                    Nie masz jeszcze żadnych scenariuszy. 
                    <Link href="/creator" className="text-accent hover:underline ml-1">Stwórz pierwszy!</Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {scenarios.map(scenario => (
                        <div key={scenario.id} className="bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border flex justify-between items-start hover:shadow-md transition-shadow group">
                            <div>
                                <Link href={`/scenarios/${scenario.id}`} className="block">
                                    <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{scenario.title}</h3>
                                </Link>
                                <p className="text-muted-foreground text-sm line-clamp-2">{scenario.description || "Brak opisu"}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Utworzono: {new Date(scenario.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                                        title="Usuń scenariusz"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Czy na pewno chcesz usunąć ten scenariusz?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Ta akcja jest nieodwracalna. Spowoduje trwałe usunięcie scenariusza "{scenario.title}" z naszych serwerów.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteScenario(scenario.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Usuń
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
