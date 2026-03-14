import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/public/Home";
import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";
import AppLayout from "@/components/layout/AppLayout";
import UserDashboard from "@/pages/user/Dashboard";
import Transfers from "@/pages/user/Transfers";
import Portfolio from "@/pages/user/Portfolio";
import Transactions from "@/pages/user/Transactions";
import Settings from "@/pages/user/Settings";
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
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={Home} />
      <Route path="/contact" component={Home} />
      <Route path="/login" component={Login} />
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
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
