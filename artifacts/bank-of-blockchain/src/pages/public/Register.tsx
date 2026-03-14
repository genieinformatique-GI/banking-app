import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PublicLayout, { PageTitle } from "@/components/layout/PublicLayout";
import { CheckCircle } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  phone: z.string().optional(),
  country: z.string().min(2, "Pays requis"),
});

const countries = [
  "France", "Belgique", "Suisse", "Canada", "Maroc", "Algérie", "Tunisie",
  "Sénégal", "Côte d'Ivoire", "Cameroun", "Mali", "Burkina Faso", "Niger",
  "Congo", "Gabon", "Madagascar", "Mauritanie", "Togo", "Bénin", "Guinée",
  "Luxembourg", "Allemagne", "Espagne", "Italie", "Portugal", "Pays-Bas",
  "Royaume-Uni", "États-Unis", "Brésil", "Mexique", "Autre"
];

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", phone: "", country: "" }
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("bob_token", data.token);
        queryClient.invalidateQueries();
        setLocation("/dashboard");
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

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "0.9rem",
    outline: "none",
    background: "white",
  };

  return (
    <PublicLayout>
      <PageTitle title="Activation de compte" breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Activation de compte" }]} />

      <section style={{ background: "#f8f9fa", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left info */}
            <div>
              <span style={{ color: "#f6a821", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Rejoignez-nous</span>
              <h2 style={{ color: "#225473", fontSize: "2rem", fontWeight: 800, margin: "12px 0 20px", lineHeight: 1.3 }}>Ouvrez votre compte BOB en toute simplicité</h2>
              <p style={{ color: "#666", lineHeight: 1.8, marginBottom: "24px" }}>
                Accédez à notre plateforme sécurisée et commencez votre demande de remboursement en quelques minutes. Votre compte sera activé après vérification de vos informations par notre équipe.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { step: "1", title: "Remplissez le formulaire", desc: "Fournissez vos informations personnelles" },
                  { step: "2", title: "Soumettez votre dossier", desc: "Joignez les preuves de vos investissements" },
                  { step: "3", title: "Activation du compte", desc: "Notre équipe valide votre demande sous 24h" },
                  { step: "4", title: "Démarrez le remboursement", desc: "Accédez à votre espace et suivez votre dossier" },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#225473", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, fontSize: "0.95rem" }}>
                      {step}
                    </div>
                    <div>
                      <div style={{ color: "#225473", fontWeight: 700, fontSize: "0.95rem" }}>{title}</div>
                      <div style={{ color: "#777", fontSize: "0.875rem" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#225473", borderRadius: "12px", padding: "24px", color: "white" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "12px" }}>Déjà client?</h4>
                <p style={{ color: "#b8d4e8", fontSize: "0.9rem", marginBottom: "16px" }}>Connectez-vous à votre espace client pour accéder à vos services.</p>
                <Link href="/espace-client">
                  <button style={{ background: "#f6a821", color: "white", border: "none", padding: "11px 22px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
                    className="hover:opacity-90 transition-opacity">
                    Se connecter →
                  </button>
                </Link>
              </div>
            </div>

            {/* Registration Form */}
            <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <img src="https://bofblockchain.com/template/img/logo_black.png" alt="BOB" style={{ height: "45px", width: "auto", margin: "0 auto 12px" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <h3 style={{ color: "#225473", fontSize: "1.3rem", fontWeight: 800 }}>Créer mon compte</h3>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <select style={{ ...inputStyle }}
                    onChange={(e) => {}} defaultValue="">
                    <option value="">- Civilité -</option>
                    <option value="M.">Monsieur</option>
                    <option value="Mlle">Mademoiselle</option>
                    <option value="Mme">Madame</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="text" placeholder="Nom *" {...form.register("lastName")} style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = "#ddd"} />
                    {form.formState.errors.lastName && <p style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: "3px" }}>{form.formState.errors.lastName.message}</p>}
                  </div>
                  <div>
                    <input type="text" placeholder="Prénom *" {...form.register("firstName")} style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = "#ddd"} />
                    {form.formState.errors.firstName && <p style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: "3px" }}>{form.formState.errors.firstName.message}</p>}
                  </div>
                </div>

                <div>
                  <input type="email" placeholder="Email *" {...form.register("email")} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "#225473"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"} />
                  {form.formState.errors.email && <p style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: "3px" }}>{form.formState.errors.email.message}</p>}
                </div>

                <div>
                  <input type="password" placeholder="Mot de passe * (8 caractères min.)" {...form.register("password")} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "#225473"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"} />
                  {form.formState.errors.password && <p style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: "3px" }}>{form.formState.errors.password.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="tel" placeholder="Téléphone portable" {...form.register("phone")} style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = "#ddd"} />
                  </div>
                  <div>
                    <select {...form.register("country")} style={{ ...inputStyle, color: form.watch("country") ? "#333" : "#999" }}
                      onFocus={(e) => e.target.style.borderColor = "#225473"}
                      onBlur={(e) => e.target.style.borderColor = "#ddd"}>
                      <option value="">- Pays -</option>
                      {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {form.formState.errors.country && <p style={{ color: "#dc3545", fontSize: "0.78rem", marginTop: "3px" }}>{form.formState.errors.country.message}</p>}
                  </div>
                </div>

                <button type="submit" disabled={registerMutation.isPending}
                  style={{ width: "100%", background: "#225473", color: "white", border: "none", padding: "14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginTop: "8px" }}
                  className="hover:opacity-90 transition-opacity disabled:opacity-60">
                  {registerMutation.isPending ? "Création en cours..." : "Créer mon compte →"}
                </button>
              </form>

              <div style={{ borderTop: "1px solid #eee", marginTop: "20px", paddingTop: "16px", textAlign: "center" }}>
                <p style={{ color: "#777", fontSize: "0.88rem" }}>
                  Déjà client?{" "}
                  <Link href="/espace-client" style={{ color: "#225473", fontWeight: 700 }} className="hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
