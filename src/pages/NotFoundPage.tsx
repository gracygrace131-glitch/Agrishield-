import { Link } from "react-router-dom";
import { Sprout, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Sprout className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-4xl font-extrabold font-display mb-2">404</h1>
      <h2 className="text-xl font-bold mb-2 font-display">Page Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The field you are looking for does not exist or has been harvested.
      </p>
      <Link to="/dashboard">
        <Button className="cursor-pointer gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Farm Dashboard
        </Button>
      </Link>
    </div>
  );
}
