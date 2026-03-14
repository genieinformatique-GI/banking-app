import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// ── Public Pages (lazy-loaded for faster initial bundle)
const Home = lazy(() => import("@/pages/public/Home"));
const Login = lazy(() => import("@/pages/public/Login"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Register = lazy(() => import("@/pages/public/Register"));
const LaBanque = lazy(() => import("@/pages/public/LaBanque"));
const Contact = lazy(() => import("@/pages/public/Contact"));
const Engagement = lazy(() => import("@/pages/public/Engagement"));
const Partenariats = lazy(() => import("@/pages/public/Partenariats"));
const AssuranceCrypto = lazy(() => import("@/pages/public/AssuranceCrypto"));
const FAQs = lazy(() => import("@/pages/public/FAQs"));
const NotFound = lazy(() => import("@/pages/not-found"));

// ── Service Pages
const Remboursement = lazy(() => import("@/pages/public/services/Remboursement"));
const Securisation = lazy(() => import("@/pages/public/services/Securisation"));
const Conseil = lazy(() => import("@/pages/public/services/Conseil"));
const Staking = lazy(() => import("@/pages/public/services/Staking"));
const LicenceTrading = lazy(() => import("@/pages/public/services/LicenceTrading"));
const TaxeCrypto = lazy(() => import("@/pages/public/services/TaxeCrypto"));

// ── App Layout (shared)
import AppLayout from "@/components/layout/AppLayout";

// ── User Dashboard (lazy)
const UserDashboard = lazy(() => import("@/pages/user/Dashboard"));
const Transfers = lazy(() => import("@/pages/user/Transfers"));
const Portfolio = lazy(() => import("@/pages/user/Portfolio"));
const Transactions = lazy(() => import("@/pages/user/Transactions"));
const Settings = lazy(() => import("@/pages/user/Settings"));
const UserNotifications = lazy(() => import("@/pages/user/Notifications"));

// ── Admin Pages (lazy — heaviest bundle, split last)
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminTransactions = lazy(() => import("@/pages/admin/AdminTransactions"));
const AdminBankTransfers = lazy(() => import("@/pages/admin/AdminBankTransfers"));
const AdminCryptoTransfers = lazy(() => import("@/pages/admin/AdminCryptoTransfers"));
const Balances = lazy(() => import("@/pages/admin/Balances"));
const AdminNotifications = lazy(() => import("@/pages/admin/AdminNotifications"));
const AdminLogs = lazy(() => import("@/pages/admin/AdminLogs"));
const AdminSecurity = lazy(() => import("@/pages/admin/AdminSecurity"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));

// Inject JWT token into every fetch request
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = localStorage.getItem("bob_token");
  if (token) {
    init = init || {};
    const headers = new Headers(init.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    init = { ...init, headers };
  }
  return originalFetch(input, init);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
  },
});

// Minimal loader shown while a lazy chunk is fetching
function PageLoader() {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "transparent",
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: "50%",
        border: "3px solid rgba(246,168,33,0.2)",
        borderTopColor: "#f6a821",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* ── PUBLIC ROUTES ── */}
        <Route path="/" component={Home} />
        <Route path="/la-banque" component={LaBanque} />
        <Route path="/contact" component={Contact} />
        <Route path="/engagement-securite-et-transparence" component={Engagement} />
        <Route path="/partenariats-amf-sec" component={Partenariats} />
        <Route path="/nos-services/assurance-crypto" component={AssuranceCrypto} />
        <Route path="/nos-services/faqs" component={FAQs} />
        <Route path="/nos-services/remboursement-des-pertes" component={Remboursement} />
        <Route path="/nos-services/securisation-des-investissements" component={Securisation} />
        <Route path="/nos-services/conseil-et-accompagnement" component={Conseil} />
        <Route path="/nos-services/services-de-staking" component={Staking} />
        <Route path="/nos-services/licence-de-trading" component={LicenceTrading} />
        <Route path="/nos-services/taxe-crypto" component={TaxeCrypto} />

        {/* ── AUTH ROUTES ── */}
        <Route path="/espace-client" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/ouverture-de-compte" component={Register} />
        <Route path="/register" component={Register} />
        <Route path="/mot-de-passe-oublie" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        {/* ── USER DASHBOARD ── */}
        <Route path="/dashboard">
          <AppLayout><Suspense fallback={<PageLoader />}><UserDashboard /></Suspense></AppLayout>
        </Route>
        <Route path="/dashboard/portfolio">
          <AppLayout><Suspense fallback={<PageLoader />}><Portfolio /></Suspense></AppLayout>
        </Route>
        <Route path="/dashboard/transfers">
          <AppLayout><Suspense fallback={<PageLoader />}><Transfers /></Suspense></AppLayout>
        </Route>
        <Route path="/dashboard/transactions">
          <AppLayout><Suspense fallback={<PageLoader />}><Transactions /></Suspense></AppLayout>
        </Route>
        <Route path="/dashboard/notifications">
          <AppLayout><Suspense fallback={<PageLoader />}><UserNotifications /></Suspense></AppLayout>
        </Route>
        <Route path="/dashboard/settings">
          <AppLayout><Suspense fallback={<PageLoader />}><Settings /></Suspense></AppLayout>
        </Route>

        {/* ── ADMIN ROUTES ── */}
        <Route path="/admin">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/users">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminUsers /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/transactions">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminTransactions /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/bank-transfers">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminBankTransfers /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/crypto-transfers">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminCryptoTransfers /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/balances">
          <AppLayout><Suspense fallback={<PageLoader />}><Balances /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/notifications">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminNotifications /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/logs">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminLogs /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/security">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminSecurity /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/content">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminContent /></Suspense></AppLayout>
        </Route>
        <Route path="/admin/profile">
          <AppLayout><Suspense fallback={<PageLoader />}><AdminProfile /></Suspense></AppLayout>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
