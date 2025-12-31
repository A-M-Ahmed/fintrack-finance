import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/layouts/Layout";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

// Placeholder pages for routes not yet implemented
const Wallets = () => <div>Wallets Page (Coming Soon)</div>;
const Transactions = () => <div>Transactions Page (Coming Soon)</div>;
const Invoices = () => <div>Invoices Page (Coming Soon)</div>;
const Settings = () => <div>Settings Page (Coming Soon)</div>;

export default function App() {
  const initAuth = useAuthStore((state) => state.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
