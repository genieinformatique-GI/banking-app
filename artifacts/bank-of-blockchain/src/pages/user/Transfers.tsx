import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateBankTransfer, useCreateCryptoTransfer } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Building, Bitcoin } from "lucide-react";

const bankTransferSchema = z.object({
  amount: z.coerce.number().positive("Montant doit être positif"),
  currency: z.enum(["EUR", "USD"]),
  beneficiaryName: z.string().min(2, "Nom requis"),
  iban: z.string().min(15, "IBAN invalide"),
  bic: z.string().optional(),
  bankName: z.string().optional(),
  reference: z.string().optional()
});

const cryptoTransferSchema = z.object({
  amount: z.coerce.number().positive("Montant doit être positif"),
  cryptocurrency: z.enum(["BTC", "ETH", "USDT"]),
  walletAddress: z.string().min(10, "Adresse invalide"),
  network: z.string().optional()
});

export default function Transfers() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"bank" | "crypto">("bank");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBankTransfer = useCreateBankTransfer({
    mutation: {
      onSuccess: () => {
        toast({ title: "Virement initié", description: "Votre demande de virement est en cours de traitement." });
        queryClient.invalidateQueries();
        bankForm.reset();
      },
      onError: (err) => toast({ title: "Erreur", description: err.message, variant: "destructive" })
    }
  });

  const createCryptoTransfer = useCreateCryptoTransfer({
    mutation: {
      onSuccess: () => {
        toast({ title: "Transfert initié", description: "Votre transfert crypto est en attente de validation." });
        queryClient.invalidateQueries();
        cryptoForm.reset();
      },
      onError: (err) => toast({ title: "Erreur", description: err.message, variant: "destructive" })
    }
  });

  const bankForm = useForm<z.infer<typeof bankTransferSchema>>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: { currency: "EUR" }
  });

  const cryptoForm = useForm<z.infer<typeof cryptoTransferSchema>>({
    resolver: zodResolver(cryptoTransferSchema),
    defaultValues: { cryptocurrency: "BTC" }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">{t.transfers.title}</h1>
        <p className="text-muted-foreground mt-1">{t.transfers.subtitle}</p>
      </div>

      <div className="flex gap-2 p-1 bg-secondary rounded-xl w-full sm:w-fit mb-8">
        <button
          onClick={() => setActiveTab("bank")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-semibold transition-all text-sm ${activeTab === 'bank' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Building className="w-4 h-4" /> {(t as any).transfers.bankTab}
        </button>
        <button
          onClick={() => setActiveTab("crypto")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-semibold transition-all text-sm ${activeTab === 'crypto' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Bitcoin className="w-4 h-4" /> {(t as any).transfers.cryptoTab}
        </button>
      </div>

      {activeTab === "bank" && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>{(t as any).transfers.newSepaTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={bankForm.handleSubmit((d) => createBankTransfer.mutate({ data: d }))} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>{t.transfers.amount}</Label>
                  <Input type="number" step="0.01" {...bankForm.register("amount")} />
                </div>
                <div>
                  <Label>{t.transfers.currency}</Label>
                  <select 
                    {...bankForm.register("currency")}
                    className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                  >
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-6 mt-6">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Bénéficiaire</h4>
                
                <div>
                  <Label>Nom du bénéficiaire</Label>
                  <Input {...bankForm.register("beneficiaryName")} />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>IBAN / Numéro de compte</Label>
                    <Input {...bankForm.register("iban")} />
                  </div>
                  <div>
                    <Label>BIC / SWIFT (Optionnel)</Label>
                    <Input {...bankForm.register("bic")} />
                  </div>
                </div>

                <div>
                  <Label>Nom de la banque (Optionnel)</Label>
                  <Input {...bankForm.register("bankName")} />
                </div>
                
                <div>
                  <Label>{t.transfers.reference}</Label>
                  <Input {...bankForm.register("reference")} />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={createBankTransfer.isPending}>
                {createBankTransfer.isPending ? "Traitement..." : "Valider le virement"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "crypto" && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>{(t as any).transfers.cryptoWithdrawalTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={cryptoForm.handleSubmit((d) => createCryptoTransfer.mutate({ data: d }))} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>{t.transfers.amount}</Label>
                  <Input type="number" step="0.00000001" {...cryptoForm.register("amount")} />
                </div>
                <div>
                  <Label>{t.transfers.cryptocurrency}</Label>
                  <select 
                    {...cryptoForm.register("cryptocurrency")}
                    className="flex h-12 w-full rounded-xl border border-border bg-background/50 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                  >
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="ETH">ETH - Ethereum</option>
                    <option value="USDT">USDT - Tether</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-6 mt-6">
                <div>
                  <Label>{(t as any).transfers.walletDestination}</Label>
                  <Input {...cryptoForm.register("walletAddress")} placeholder="Ex: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" />
                </div>
                <div>
                  <Label>{(t as any).transfers.networkOptional}</Label>
                  <Input {...cryptoForm.register("network")} placeholder="Ex: ERC20, TRC20, Bitcoin" />
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex gap-3 text-orange-500 text-sm">
                <Bitcoin className="w-5 h-5 flex-shrink-0" />
                <p>Attention: Les transferts crypto sont irréversibles. Vérifiez attentivement l'adresse de destination et le réseau avant de valider.</p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={createCryptoTransfer.isPending}>
                {createCryptoTransfer.isPending ? t.common.loading : (t as any).transfers.submitCrypto}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
