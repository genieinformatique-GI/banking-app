import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useLogin } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("bob_token", data.token);
        queryClient.invalidateQueries();
        if (data.user.role === 'admin') {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      },
      onError: (error) => {
        toast({
          title: "Erreur de connexion",
          description: error?.message || "Identifiants invalides",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({ data: values });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
        <div className="absolute top-8 left-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Button>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex flex-col items-center sm:items-start">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">Bon retour</h2>
            <p className="text-muted-foreground mt-2">Connectez-vous à votre portail institutionnel.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email professionnel</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nom@entreprise.com" 
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="mb-0">Mot de passe</Label>
                <a href="#" className="text-sm font-semibold text-primary hover:underline">Oublié ?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Demander une ouverture
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative flex-1 bg-secondary/50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Background" 
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
          />
        </div>
      </div>
    </div>
  );
}
