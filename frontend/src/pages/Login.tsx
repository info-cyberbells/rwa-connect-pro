import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import navbarLogo from "@/assets/navbar.webp"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store"; // adjust path
import { login } from "../features/authSlice";

type UserRole = "member" | "society-admin" | "super-admin";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("member");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
 
  const resultAction = await dispatch(login({ email, password }));
 
  if (login.fulfilled.match(resultAction)) {
    const userRole = resultAction.payload.user.role; // get real role
 
    toast({
      title: "Login Successful",
      description: "Welcome back to SocietySmartHub!",
    });
 
    // Navigate based on backend role
    switch (userRole) {
      case "superadmin":
        navigate("/super-admin");
        break;
      case "society_admin":
        navigate("/society-admin");
        break;
      case "user":
        navigate("/member");
        break;
      default:
        navigate("/");
    }
  } else {
    toast({
      title: "Login Failed",
      description: (resultAction.payload as string) || "Login failed",
      variant: "destructive",
    });
  }
}; 
 

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl">
              <img src={navbarLogo} alt="Logo" className="w-36 h-50 object-contain" />
            </div>
          </Link>

          <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="mb-3 block">Login As</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "member", label: "Member" },
                { value: "society-admin", label: "Society Admin" },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value as UserRole)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedRole === role.value
                    ? "hero-gradient text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <input
              type="text"
              name="fake-username"
              autoComplete="username"
              className="hidden"
            />
            <input
              type="password"
              name="fake-password"
              autoComplete="new-password"
              className="hidden"
            />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-primary cursor-pointer">
                <Label htmlFor="password">Password</Label>
                {/* <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                > */}
                Forgot password?
                {/* </Link> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
          {selectedRole === "society-admin" && (
            <p className="mt-8 text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          )}
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center hero-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative text-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Building2 className="w-24 h-24 text-primary-foreground/20 mx-auto mb-8" />
            <h2 className="text-3xl font-heading font-bold text-primary-foreground mb-4">
              Manage Your Society Smarter
            </h2>
            <p className="text-primary-foreground/80 max-w-md">
              Access member management, payment tracking, notices, and more from your personalized dashboard.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
