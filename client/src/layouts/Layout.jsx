import { useEffect } from "react";
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import useThemeStore from "@/store/useThemeStore";
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  Settings, 
  LogOut, 
  Menu,
  ArrowRightLeft,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Layout() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/signin" />;


  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start gap-2 mb-1"
        >
          <Icon className="h-4 w-4" />
          {children}
        </Button>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex bg-card flex-col h-full border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center text-xs">F</div>
          FinTrack
        </h1>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
              Main Menu
            </h2>
            <div className="space-y-1">
              <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/wallets" icon={Wallet}>My Wallets</NavLink>
              <NavLink to="/transactions" icon={ArrowRightLeft}>Transactions</NavLink>
              <NavLink to="/invoices" icon={Receipt}>Invoices</NavLink>
              <NavLink to="/settings" icon={Settings}>Settings</NavLink>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out of your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Log Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed h-full z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 bg-muted/20 min-h-screen">
        <Outlet />
      </main>
      
      {/* Toaster removed from here, handled in App.jsx */}
    </div>
  );
}
