"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pinyon_Script } from "next/font/google";
import ThemeBackground from "@/components/ThemeBackground";

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in and redirect
  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          router.push(redirectTo);
        }
      })
      .catch(() => {
        // Ignore errors, user can still try to login
      });
  }, [router, redirectTo]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful - redirect to intended page
        router.push(redirectTo);
        router.refresh();
      } else {
        // Login failed - show error
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F0F2F4] overflow-hidden">
      <ThemeBackground />

      <div
        className="w-full max-w-md px-6 relative z-10"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "calc(1.5rem + env(safe-area-inset-left))",
          paddingRight: "calc(1.5rem + env(safe-area-inset-right))",
        }}
      >
        {/* Logo/Title */}
        <div className="text-center mb-12 relative">
          <h1
            className={`${pinyonScript.className} text-7xl text-[#1a1a1a] mb-2 relative flex items-center justify-center`}
          >
            <span className="text-9xl leading-[0.8] mr-[0.02em]">A</span>than
            Notes
          </h1>
          <p className="text-[#5A5A5A] text-sm mt-4 tracking-wide">
            Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#37352f] mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/80 border border-[#d3d1cb] rounded-md 
                         text-[#37352f] placeholder-[#9b9a97]
                         focus:outline-none focus:ring-2 focus:ring-[#2383e2] focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-150"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#37352f] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/80 border border-[#d3d1cb] rounded-md 
                         text-[#37352f] placeholder-[#9b9a97]
                         focus:outline-none focus:ring-2 focus:ring-[#2383e2] focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-150"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#fbe4e4] border border-[#f1aeb5] rounded-md p-3">
                <p className="text-sm text-[#eb5757]">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a1a1a] text-white py-3 rounded-md font-medium
                       hover:bg-[#333] active:bg-[#000]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150 shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#787774]">
              Single-user authentication for Athan Notes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-[#787774]">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
