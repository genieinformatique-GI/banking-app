import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  ListOrdered, 
  Settings, 
  Users, 
  Building, 
  Bitcoin, 
  Bell, 
  FileText, 
  ShieldCheck,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      retry: false,
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !user) {
    window.location.href = "/login";
    return null;
  }

  if (user.status === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Account Pending Activation</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          Your account has been created successfully but is currently waiting for administrator approval. 
          You will receive an email once it's active.
        </p>
        <button 
          onClick={() => {
            localStorage.removeItem("bob_token");
            window.location.href = "/login";
          }}
          className="mt-8 text-primary hover:underline"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (user.status === "suspended") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Account Suspended</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          Your account has been suspended by an administrator. Please contact support for more information.
        </p>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const basePath = isAdmin ? "/admin" : "/dashboard";

  // Prevent user from accessing admin and vice versa
  if (isAdmin && location.startsWith("/dashboard")) {
    setLocation("/admin");
    return null;
  }
  if (!isAdmin && location.startsWith("/admin")) {
    setLocation("/dashboard");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("bob_token");
    queryClient.clear();
    window.location.href = "/login";
  };

  const navItems = isAdmin ? [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Utilisateurs", path: "/admin/users", icon: Users },
    { label: "Transactions", path: "/admin/transactions", icon: ListOrdered },
    { label: "Virements", path: "/admin/bank-transfers", icon: Building },
    { label: "Crypto", path: "/admin/crypto-transfers", icon: Bitcoin },
    { label: "Soldes", path: "/admin/balances", icon: Wallet },
    { label: "Notifications", path: "/admin/notifications", icon: Bell },
    { label: "Logs Système", path: "/admin/logs", icon: FileText },
  ] : [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Portfolio", path: "/dashboard/portfolio", icon: Wallet },
    { label: "Transferts", path: "/dashboard/transfers", icon: ArrowRightLeft },
    { label: "Transactions", path: "/dashboard/transactions", icon: ListOrdered },
    { label: "Paramètres", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="font-display font-bold text-xl text-sidebar-foreground tracking-tight">BankOfBlockchain</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto hide-scrollbar">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
            {isAdmin ? 'ADMINISTRATION' : 'MENU PRINCIPAL'}
          </div>
          {navItems.map((item) => {
            const isActive = location === item.path || (location.startsWith(item.path + '/') && item.path !== basePath);
            return (
              <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                <div className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-sidebar-foreground/70 hover:bg-secondary hover:text-sidebar-foreground'}
                `}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border mt-auto">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-display font-bold hidden sm:block">
              {navItems.find(i => i.path === location)?.label || 'Overview'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Status:</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Système Opérationnel
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
          <div className="max-w-7xl mx-auto w-full pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
