import { SignupForm } from "@/components/auth/SignupForm";

const AuthSignup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <SignupForm />
    </div>
  );
};

export default AuthSignup;
