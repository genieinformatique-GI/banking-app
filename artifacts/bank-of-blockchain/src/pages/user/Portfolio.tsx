import { useGetMyBalances } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Euro, DollarSign, Bitcoin, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fakeChartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

export default function Portfolio() {
  const { data, isLoading } = useGetMyBalances();
  
  const balances = data?.balances || { eur: 0, usd: 0, btc: 0 };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Mon Portefeuille</h1>
        <p className="text-muted-foreground mt-1">Aperçu de vos actifs et évolution de votre capital.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Solde EUR</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Euro className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-10 bg-secondary animate-pulse rounded-lg w-1/2"></div>
            ) : (
              <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                {formatCurrency(balances.eur, 'EUR')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Solde USD</CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-10 bg-secondary animate-pulse rounded-lg w-1/2"></div>
            ) : (
              <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                {formatCurrency(balances.usd, 'USD')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-medium">Solde BTC</CardTitle>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Bitcoin className="w-4 h-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-10 bg-secondary animate-pulse rounded-lg w-1/2"></div>
            ) : (
              <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                {balances.btc.toFixed(8)} <span className="text-xl text-muted-foreground">BTC</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Évolution du Capital</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Valeur totale estimée en EUR sur les 6 derniers mois</p>
          </div>
          <TrendingUp className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fakeChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
