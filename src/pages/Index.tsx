import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Building2, Users, DollarSign } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard/mis");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              University MIS
              <span className="block text-primary mt-2">Admin Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive campus resource management system for administrators
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth/signup")}>
              Create Account
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">MIS Admin</h3>
            <p className="text-muted-foreground">
              Manage campus rooms, approve requests, and monitor usage with an interactive map interface.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Registrar Admin</h3>
            <p className="text-muted-foreground">
              Handle student records, academic guidance, and room allocation for educational purposes.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold">Accounting Admin</h3>
            <p className="text-muted-foreground">
              Track financial records, room usage billing, and generate comprehensive expense reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
