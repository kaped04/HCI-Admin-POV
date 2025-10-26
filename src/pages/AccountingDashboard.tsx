import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AccountingDashboard = () => {
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
      .eq("role", "accounting_admin")
      .single();

    if (!roleData) {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Accounting Dashboard" />
      
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accounting Admin Portal</CardTitle>
            <CardDescription>
              Financial tracking and room usage billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This dashboard is ready for accounting-specific features such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Room usage financial reports</li>
              <li>Billing and payment tracking</li>
              <li>Event charges management</li>
              <li>Expense and revenue analysis</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AccountingDashboard;
