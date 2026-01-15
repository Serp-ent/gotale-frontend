"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UsersApi, User, Configuration } from '@/lib/api';
import { axiosInstance } from '@/app/components/auth-provider';
import { UserCircle, Loader2 } from "lucide-react";
import { toast } from 'sonner';

export default function UserProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const apiConfig = new Configuration({ basePath: 'http://localhost:8000' });
        const usersApi = new UsersApi(apiConfig, undefined, axiosInstance);
        const response = await usersApi.usersRetrieve(id);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        toast.error("Nie znaleziono użytkownika.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 p-4 flex justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto mt-20 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Użytkownik nie istnieje</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-4 max-w-2xl">
      <div className="bg-card text-card-foreground p-8 rounded-xl shadow-md border border-border flex flex-col items-center">
        <div className="bg-accent/10 p-4 rounded-full mb-4">
            <UserCircle size={64} className="text-accent" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
        {/* Email might be private for other users, checking API response would be ideal, assuming public for now or null */}
        {user.email && <p className="text-muted-foreground mb-6">{user.email}</p>}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-background rounded-lg border border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase">Imię</span>
                <p className="text-lg">{user.first_name || '-'}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase">Nazwisko</span>
                <p className="text-lg">{user.last_name || '-'}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border md:col-span-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">ID Użytkownika</span>
                <p className="font-mono text-sm">{user.id}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
