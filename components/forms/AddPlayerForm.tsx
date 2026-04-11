"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const EMOJI_OPTIONS = ["🏅", "⚡", "🔥", "💪", "🎯", "🚀", "👑", "🦁", "🐉", "🌟", "🎮", "🏆"];

const playerSchema = z.object({
  name: z.string().min(2, "Il nome deve essere almeno 2 caratteri").max(30, "Max 30 caratteri"),
  emoji: z.string().min(1),
});

type PlayerForm = z.infer<typeof playerSchema>;

export function AddPlayerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🏅");

  const form = useForm<PlayerForm>({
    resolver: zodResolver(playerSchema),
    defaultValues: { name: "", emoji: "🏅" },
  });

  async function onSubmit(values: PlayerForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, emoji: selectedEmoji }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Errore");
      }

      toast.success(`${selectedEmoji} ${values.name} aggiunto!`);
      form.reset();
      setSelectedEmoji("🏅");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Es. Marco Rossi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Emoji avatar</FormLabel>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`text-xl p-1.5 rounded-lg transition-all ${
                  selectedEmoji === emoji
                    ? "bg-primary/20 ring-2 ring-primary scale-110"
                    : "hover:bg-accent"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Aggiungi Giocatore"
          )}
        </Button>
      </form>
    </Form>
  );
}
