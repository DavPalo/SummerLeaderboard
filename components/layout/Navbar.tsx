"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Trophy, LogIn, LogOut, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface NavbarProps {
  user?: { email?: string } | null;
}

const navLinks = [
  { href: "/leaderboard", label: "Classifiche", icon: "🏆" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logout effettuato!");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg gradient-primary opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight text-gradient">Salimos de fiesta</span>
              <span className="text-xs font-semibold text-muted-foreground tracking-widest">classifiche estive</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" variant="gradient">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Accedi
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-border/50">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground px-3">{user.email}</p>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium gradient-primary text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Accedi
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
