"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "Password deve essere almeno 6 caratteri"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginForm) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(
        error.message === "Invalid login credentials"
          ? "Credenziali non valide"
          : error.message
      );
      setLoading(false);
      return;
    }

    toast.success("Benvenuto! 🎉");
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.1)_0%,transparent_60%)]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(234,179,8,0.08)_0%,transparent_60%)]" />

      <header className="relative z-10 p-4">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alle classifiche
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-xl glow-primary mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <p className="text-muted-foreground text-sm mt-1">Accedi per gestire le classifiche</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-bold">Accesso Admin</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="email" placeholder="admin@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" variant="gradient" size="lg" disabled={loading}>
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Accedi"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Solo gli admin possono accedere · Le classifiche sono pubbliche
          </p>
        </div>
      </main>
    </div>
  );
}
