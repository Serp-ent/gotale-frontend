'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, UserCircle } from "lucide-react";

const links = [
  { url: "/scenarios", label: "Scenariusze" },
  { url: "/creator", label: "Kreator" },
    { url: "/harmonogram", label: "Harmonogram" },
    { url: "/docs", label: "Dokumentacja" },
];

export default function Header() {
  const { isAuthenticated, user, logout, setShowLoginModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0)
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderVisible(false);
        // setIsMenuOpen(false);  // optional?
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if ((navRef.current && !navRef.current.contains(event.target as Node))
        && (buttonRef.current && !buttonRef.current.contains(event.target as Node))) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [lastScrollY]);

  return (
    <header className={`z-50 shadow text-background bg-foreground dark:text-primary dark:bg-card flex justify-between items-center p-1 sm:p-4 w-screen transform transition-transform duration-200 fixed ${isHeaderVisible ? "translate-y-0" : '-translate-y-full'}`}>
      <Link
        className="p-1 flex gap-1 align-center items-center"
        href={"/"}
      >
        <div className="aspect-square h-8 grid place-content-center">
          <Image
            src="/logo.svg"
            alt="GoTale logo"
            width={36}
            height={36}
          />
        </div>
        <div className="text-xl font-bold ml-2 hidden sm:block">
          Go<span className="text-accent">Tale</span>
        </div>
      </Link>

      {/* Mobile menu */}
      <div className="md:hidden">
        <section className="relative flex items-center">
          <button
            className="pr-2 mr-2"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            ref={buttonRef}
          >
            <AiOutlineMenu size={24} />
          </button>

        </section>


        <section className={`
  ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
  transition-transform absolute top-full w-52 sm:w-72 right-0 h-screen text-sm p-2 bg-background border border-gray-900 shadow-gray-800 shadow-lg
`}
          ref={navRef}
        >
          <nav className="flex flex-col gap-2">
            {links.map((l, i) => (
              <Link
                href={l.url}
                key={i}
                className={`
          font-semibold text-center border-gray-600 border-b px-3 py-1 my-1 rounded hover:bg-accent dark:text-primary hover:text-primary transition-colors duration-150
          ${pathname === l.url
                    ? 'dark:text-card bg-foreground text-background dark:bg-slate-950'  // Selected item colors
                    : 'dark:foreground text-gray-800'}  // Default colors
        `}
                onClick={() => setIsMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            
            <div className="mt-2 border-t border-gray-600 pt-2 flex flex-col items-center gap-2">
              {isAuthenticated ? (
                 <>
                    <div className="font-semibold text-accent">{user?.username}</div>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm hover:text-accent">Profil</Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-sm text-red-500 hover:text-red-400">Wyloguj</button>
                 </>
              ) : (
                 <Button size="sm" onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="w-full bg-accent text-white">
                    Zaloguj się
                 </Button>
              )}
            </div>

          </nav>

          <div className="flex justify-end mt-2 pr-2">
            <ModeToggle />
          </div>
        </section>
      </div>

      {/* Navigation for larger screens */}
      <section className="hidden md:flex items-center mr-4">
        <nav className="flex mr-4 gap-4 items-center">
          {links.map((l, i) => (
            <Link
              href={l.url}
              key={i}
              className={`font-medium text-sm transition-colors duration-150 ${pathname === l.url ? "border-b-2 border-accent" : ""
                }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mr-4 flex items-center gap-2">
           {isAuthenticated ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                      <UserCircle className="!h-8 !w-8" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                   <DropdownMenuLabel>
                      <div className="flex flex-col">
                         <span>{user?.username}</span>
                         <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" /> Profil
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" /> Wyloguj
                   </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
           ) : (
             <Button size="sm" onClick={() => setShowLoginModal(true)} className="bg-accent hover:bg-accent/90 text-white font-semibold">
               Zaloguj się
             </Button>
           )}
        </div>

        <ModeToggle />
      </section>
    </header>
  );
}
