import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";

const Auth = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              MIS Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage campus resources efficiently
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Interactive Campus Map</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize and manage all campus locations in real-time
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Room Request Management</h3>
                <p className="text-sm text-muted-foreground">
                  Approve or decline room requests with one click
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Comprehensive Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Track usage statistics and identify high-demand rooms
                </p>
              </div>
            </div>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Auth;
