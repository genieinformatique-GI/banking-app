import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Public Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/public/Home";
import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";
import LaBanque from "@/pages/public/LaBanque";
import Contact from "@/pages/public/Contact";
import Engagement from "@/pages/public/Engagement";
import Partenariats from "@/pages/public/Partenariats";
import AssuranceCrypto from "@/pages/public/AssuranceCrypto";
import FAQs from "@/pages/public/FAQs";
import Remboursement from "@/pages/public/services/Remboursement";
import Securisation from "@/pages/public/services/Securisation";
import Conseil from "@/pages/public/services/Conseil";
import Staking from "@/pages/public/services/Staking";
import LicenceTrading from "@/pages/public/services/LicenceTrading";
import TaxeCrypto from "@/pages/public/services/TaxeCrypto";
import AppLayout from "@/components/layout/AppLayout";
import UserDashboard from "@/pages/user/Dashboard";
import Transfers from "@/pages/user/Transfers";
import Portfolio from "@/pages/user/Portfolio";
import Transactions from "@/pages/user/Transactions";
import Settings from "@/pages/user/Settings";
import UserNotifications from "@/pages/user/Notifications";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminTransactions from "@/pages/admin/AdminTransactions";
import AdminBankTransfers from "@/pages/admin/AdminBankTransfers";
import AdminCryptoTransfers from "@/pages/admin/AdminCryptoTransfers";
import Balances from "@/pages/admin/Balances";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminSecurity from "@/pages/admin/AdminSecurity";

// Setup fetch interceptor to inject JWT token automatically to all requests
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = localStorage.getItem('bob_token');
  if (token) {
    init = init || {};
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return originalFetch(input, init);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* ====== PUBLIC ROUTES ====== */}
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
      {/* Auth routes — real site URL aliases */}
      <Route path="/espace-client" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/ouverture-de-compte" component={Register} />
      <Route path="/register" component={Register} />

      {/* User Dashboard Routes */}
      <Route path="/dashboard">
        <AppLayout><UserDashboard /></AppLayout>
      </Route>
      <Route path="/dashboard/portfolio">
        <AppLayout><Portfolio /></AppLayout>
      </Route>
      <Route path="/dashboard/transfers">
        <AppLayout><Transfers /></AppLayout>
      </Route>
      <Route path="/dashboard/transactions">
        <AppLayout><Transactions /></AppLayout>
      </Route>
      <Route path="/dashboard/notifications">
        <AppLayout><UserNotifications /></AppLayout>
      </Route>
      <Route path="/dashboard/settings">
        <AppLayout><Settings /></AppLayout>
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/admin">
        <AppLayout><AdminDashboard /></AppLayout>
      </Route>
      <Route path="/admin/users">
        <AppLayout><AdminUsers /></AppLayout>
      </Route>
      <Route path="/admin/transactions">
        <AppLayout><AdminTransactions /></AppLayout>
      </Route>
      <Route path="/admin/bank-transfers">
        <AppLayout><AdminBankTransfers /></AppLayout>
      </Route>
      <Route path="/admin/crypto-transfers">
        <AppLayout><AdminCryptoTransfers /></AppLayout>
      </Route>
      <Route path="/admin/balances">
        <AppLayout><Balances /></AppLayout>
      </Route>
      <Route path="/admin/notifications">
        <AppLayout><AdminNotifications /></AppLayout>
      </Route>
      <Route path="/admin/logs">
        <AppLayout><AdminLogs /></AppLayout>
      </Route>
      <Route path="/admin/security">
        <AppLayout><AdminSecurity /></AppLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
