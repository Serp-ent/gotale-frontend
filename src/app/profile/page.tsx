"use client";

import { useAuth } from "@/app/components/auth-provider";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto mt-20 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Dostęp zabroniony</h1>
        <p>Musisz się zalogować, aby zobaczyć ten profil.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-4 max-w-2xl">
      <div className="bg-card text-card-foreground p-8 rounded-xl shadow-md border border-border flex flex-col items-center">
        <div className="bg-accent/10 p-4 rounded-full mb-4">
            <UserCircle size={64} className="text-accent" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
        <p className="text-muted-foreground mb-6">{user?.email}</p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-background rounded-lg border border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase">Imię</span>
                <p className="text-lg">{user?.first_name || '-'}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase">Nazwisko</span>
                <p className="text-lg">{user?.last_name || '-'}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border md:col-span-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">ID Użytkownika</span>
                <p className="font-mono text-sm">{user?.id}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
