import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRegister } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  phone: z.string().optional(),
  country: z.string().min(2, "Pays requis"),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      firstName: "", lastName: "", email: "", password: "", phone: "", country: "" 
    }
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("bob_token", data.token);
        queryClient.invalidateQueries();
        setLocation("/dashboard"); // AppLayout will catch pending status and show the message
      },
      onError: (error) => {
        toast({
          title: "Erreur d'inscription",
          description: error?.message || "Vérifiez vos informations",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({ data: values });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-20 border-b border-border flex items-center px-8">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">BankOfBlockchain</span>
          </div>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-2">Demande d'ouverture de compte</h2>
            <p className="text-muted-foreground mb-8">Remplissez ce formulaire. Votre compte devra être validé par notre équipe compliance.</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" {...form.register("firstName")} />
                  {form.formState.errors.firstName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" {...form.register("lastName")} />
                  {form.formState.errors.lastName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email professionnel</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" {...form.register("password")} />
                {form.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" {...form.register("phone")} />
                </div>
                <div>
                  <Label htmlFor="country">Pays de résidence</Label>
                  <Input id="country" {...form.register("country")} />
                  {form.formState.errors.country && <p className="text-red-500 text-xs mt-1">{form.formState.errors.country.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Soumission en cours..." : "Soumettre la demande"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Déjà client ?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
