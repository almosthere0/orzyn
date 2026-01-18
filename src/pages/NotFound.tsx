import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center gradient-hero dark">
      <div className="text-center px-4">
        <div className="text-8xl font-display font-bold text-gradient-primary mb-4">404</div>
        <h1 className="text-2xl font-display font-semibold text-white mb-2">
          Page not found
        </h1>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Looks like you wandered off campus. Let's get you back to familiar territory.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="hero" asChild>
            <Link to="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="glass" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
