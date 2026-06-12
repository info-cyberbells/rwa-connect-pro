import React from "react";
import {
  Building,
  Mail,
  Lock,
  Eye,
  ArrowRight,
} from "lucide-react";

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center px-6 font-sans relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-card/90 backdrop-blur-xl rounded-[3rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-border">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <Building className="text-white" size={26} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Luxe<span className="text-blue-600">Society</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Sign in to your society dashboard
          </p>
        </div>

        {/* Form UI */}
        <div className="space-y-6">

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                placeholder="admin@society.com"
                className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-5 focus:bg-card focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-14 focus:bg-card focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
              <Eye
                size={18}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              />
            </div>
          </div>

          {/* Forgot */}
          <div className="flex justify-end">
            <span className="text-xs font-bold text-muted-foreground hover:text-blue-600 cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_20px_40px_-12px_rgba(37,99,235,0.45)] transition-all hover:scale-[1.02]"
          >
            Sign In <ArrowRight size={20} />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2026 LuxeSociety. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Admin;
