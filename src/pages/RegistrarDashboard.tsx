import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RegistrarDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "registrar_admin")
      .single();

    if (!roleData) {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Registrar Dashboard" />
      
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Admin Portal</CardTitle>
            <CardDescription>
              Manage academic records and student guidance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This dashboard is ready for registrar-specific features such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Student academic records management</li>
              <li>Room allocation guidance for academic purposes</li>
              <li>Enrollment tracking</li>
              <li>Academic reports generation</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RegistrarDashboard;
