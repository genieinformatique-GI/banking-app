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
  X,
  Sun,
  Moon,
  ChevronRight,
  Globe
} from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@assets/logo.jpg";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { data: user, isLoading, isError } = useGetMe({ query: { retry: false } });
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
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">{(t as any).app.pendingTitle}</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          {(t as any).app.pendingDesc}
          {(t as any).app.pendingEmail}
        </p>
        <button
          onClick={() => { localStorage.removeItem("bob_token"); window.location.href = "/login"; }}
          className="mt-8 text-primary hover:underline font-medium"
        >
          {t.common.back}
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
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">{(t as any).app.suspendedTitle}</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          {(t as any).app.suspendedDesc}
        </p>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const basePath = isAdmin ? "/admin" : "/dashboard";

  if (isAdmin && location.startsWith("/dashboard")) { setLocation("/admin"); return null; }
  if (!isAdmin && location.startsWith("/admin")) { setLocation("/dashboard"); return null; }

  const handleLogout = () => {
    localStorage.removeItem("bob_token");
    queryClient.clear();
    window.location.href = "/login";
  };

  const adminNavItems = [
    { label: t.nav.admin.dashboard, path: "/admin", icon: LayoutDashboard },
    { label: t.nav.admin.users, path: "/admin/users", icon: Users },
    { label: t.nav.admin.transactions, path: "/admin/transactions", icon: ListOrdered },
    { label: t.nav.admin.bankTransfers, path: "/admin/bank-transfers", icon: Building },
    { label: t.nav.admin.cryptoTransfers, path: "/admin/crypto-transfers", icon: Bitcoin },
    { label: t.nav.admin.balances, path: "/admin/balances", icon: Wallet },
    { label: t.nav.admin.notifications, path: "/admin/notifications", icon: Bell },
    { label: t.nav.admin.content, path: "/admin/content", icon: Globe },
    { label: t.nav.admin.logs, path: "/admin/logs", icon: FileText },
    { label: "Mon Profil", path: "/admin/profile", icon: Settings },
  ];

  const userNavItems = [
    { label: t.nav.dashboard, path: "/dashboard", icon: LayoutDashboard },
    { label: t.nav.balances, path: "/dashboard/portfolio", icon: Wallet },
    { label: t.nav.transfers, path: "/dashboard/transfers", icon: ArrowRightLeft },
    { label: t.nav.transactions, path: "/dashboard/transactions", icon: ListOrdered },
    { label: t.nav.notifications, path: "/dashboard/notifications", icon: Bell },
    { label: t.nav.settings, path: "/dashboard/settings", icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const currentLabel = navItems.find(i =>
    i.path === location || (location.startsWith(i.path + '/') && i.path !== basePath)
  )?.label || (isAdmin ? "Administration" : "Mon Espace");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-68 flex flex-col
        border-r border-sidebar-border bg-sidebar
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} style={{ width: "260px" }}>

        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/30 flex-shrink-0 bg-white">
            <img src={logo} alt="Bank of Blockchain" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-sidebar-foreground tracking-tight leading-none">Bank of Blockchain</span>
            <p className="text-xs text-muted-foreground mt-0.5">{isAdmin ? "Administration" : "Espace Client"}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            {isAdmin ? 'Menu Admin' : 'Menu Principal'}
          </p>
          {navItems.map((item) => {
            const isActive = location === item.path || (location.startsWith(item.path + '/') && item.path !== basePath);
            return (
              <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                <div className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-border/50 hover:text-sidebar-foreground'}
                `}>
                  <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: "18px", height: "18px" }} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 bg-sidebar-border/30 rounded-xl mb-2">
            {(user as any).avatarUrl
              ? <img src={(user as any).avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-primary/30" />
              : <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user.firstName[0]}{user.lastName[0]}
                </div>}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t.nav.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/90 backdrop-blur-xl flex items-center justify-between px-5 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-muted-foreground/60">{isAdmin ? "Admin" : "Dashboard"}</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
              <span className="font-semibold text-foreground">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* System status */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Opérationnel
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
              title={theme === "dark" ? (t as any).app.themeLight : (t as any).app.themeDark}
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" style={{ width: "18px", height: "18px" }} /> : <Moon className="w-4.5 h-4.5" style={{ width: "18px", height: "18px" }} />}
            </button>

            {/* X button mobile close */}
            {mobileMenuOpen && (
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-7">
          <div className="max-w-7xl mx-auto w-full pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
