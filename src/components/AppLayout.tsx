import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  Droplets,
  ShieldAlert,
  TrendingUp,
  CreditCard,
  Tractor,
  ShoppingBag,
  Home,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../utils";
import { Button } from "./ui/Button";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/crop-advisor", label: "Crop Advisor", icon: Sprout },
  { path: "/irrigation", label: "Smart Irrigation", icon: Droplets },
  { path: "/climate-risk", label: "Climate Risk", icon: ShieldAlert },
  { path: "/profit-predictor", label: "Profit Predictor", icon: TrendingUp },
  { path: "/credit-score", label: "Credit Score", icon: CreditCard },
  { path: "/machinery", label: "Machinery", icon: Tractor },
  { path: "/seeds-shop", label: "Seeds Shop", icon: ShoppingBag },
];

export function AppLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 flex-col bg-sidebar border-r border-sidebar-border select-none">
        <div className="h-16 flex items-center px-5 gap-2.5 border-b border-sidebar-border">
          <img
            src="https://hercules-cdn.com/file_BWos5c3JQPUv9Sw0Mz2iI66V"
            alt="AgriShield logo"
            className="w-8 h-8 rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <span
            className="font-bold text-sidebar-foreground text-lg tracking-tight font-display"
          >
            AgriShield
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-semibold shadow-xs"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active ? "text-sidebar-primary" : "")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground cursor-pointer"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img
            src="https://hercules-cdn.com/file_BWos5c3JQPUv9Sw0Mz2iI66V"
            alt="AgriShield logo"
            className="w-7 h-7 rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <span
            className="font-bold text-sidebar-foreground font-display"
          >
            AgriShield
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-sidebar-foreground p-1 cursor-pointer rounded-lg hover:bg-sidebar-accent"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-down Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-sidebar pt-14 flex flex-col">
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sidebar-foreground/60 cursor-pointer"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main App Content */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}

