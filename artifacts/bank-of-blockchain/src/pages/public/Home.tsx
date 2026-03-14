import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Bitcoin, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-border/50 bg-background/50 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">BankOfBlockchain</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Solutions</a>
            <a href="#" className="hover:text-foreground transition-colors">Institutions</a>
            <a href="#" className="hover:text-foreground transition-colors">Ressources</a>
            <Link href="/about" className="hover:text-foreground transition-colors">À propos</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Ouvrir un compte</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          {/* Decorative glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">La nouvelle ère bancaire est arrivée</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1] mb-8 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            La finance <span className="text-gradient">institutionnelle</span><br />
            rencontre la blockchain
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            Gérez vos actifs fiat et crypto depuis une plateforme unique, sécurisée et conçue pour les professionnels exigeants.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Commencer maintenant <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contacter les ventes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 relative z-20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 border border-primary/30">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Sécurité de Qualité Bancaire</h3>
              <p className="text-muted-foreground">Vos fonds sont protégés par les standards de sécurité les plus stricts de l'industrie financière et cryptographique.</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6 border border-accent/30">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Virements SEPA & SWIFT</h3>
                <p className="text-muted-foreground">Exécutez des virements internationaux en EUR et USD avec des taux de change institutionnels.</p>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-3xl">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 border border-orange-500/30">
                <Bitcoin className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Custody Crypto</h3>
              <p className="text-muted-foreground">Stockez et transférez du BTC, ETH et USDT sur vos propres portefeuilles sécurisés en quelques clics.</p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>@2026 Bank Of BlockChain - Tous Droits Reservés</p>
      </footer>
    </div>
  );
}
