import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";

type Role = "mis_admin" | "registrar_admin" | "accounting_admin";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("mis_admin");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has the selected role
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", role)
          .single();

        if (!roleData) {
          toast.error("You don't have permission to access this role");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        // Redirect based on role
        const dashboardRoutes: Record<Role, string> = {
          mis_admin: "/dashboard/mis",
          registrar_admin: "/dashboard/registrar",
          accounting_admin: "/dashboard/accounting",
        };

        toast.success("Login successful!");
        navigate(dashboardRoutes[role]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        <CardDescription>Select your role and enter credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label>Select Role</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as Role)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mis_admin" id="mis" />
                <Label htmlFor="mis" className="cursor-pointer font-normal">
                  MIS Admin
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="registrar_admin" id="registrar" />
                <Label htmlFor="registrar" className="cursor-pointer font-normal">
                  Registrar Admin
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accounting_admin" id="accounting" />
                <Label htmlFor="accounting" className="cursor-pointer font-normal">
                  Accounting Admin
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
