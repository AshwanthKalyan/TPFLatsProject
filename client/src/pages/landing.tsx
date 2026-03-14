import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Terminal } from "lucide-react";
import {
  ClerkLoading,
  ClerkLoaded,
  Show
} from "@clerk/react-router";

export default function Landing() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldAlert =
      window.sessionStorage.getItem("nittAuthError") === "1" ||
      params.get("auth") === "nitt";

    if (!shouldAlert) {
      return;
    }

    window.sessionStorage.removeItem("nittAuthError");
    window.alert("Use nitt webmail only!");

    if (location !== "/") {
      setLocation("/", { replace: true });
    }
  }, [location, setLocation]);

  const handleEnter = () => {
    setLocation("/auth");
  };

  const handleAuth = () => {
    setLocation("/projects");
  };

  return (
    <>
      <ClerkLoading>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Terminal className="h-12 w-12 text-primary animate-pulse" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center">
          <WebGLShader className="absolute inset-0 z-0 pointer-events-none opacity-60" />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block border border-primary/50 bg-background/50 backdrop-blur-sm px-4 py-1.5 text-primary font-mono text-sm tracking-widest mb-8 brutal-shadow">
              THE PRODUCT FOLKS - NITT
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tighter mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
              BUILD THE <span className="text-primary">FUTURE</span>
            </h1>

            <p className="font-mono text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
              Connect with top builders at NITT. Post projects, find teams, and
              execute high-impact ideas. The grid is waiting.
            </p>

            <Show when="signed-out">
              <LiquidGlassButton onClick={handleEnter}>
                AUTHENTICATE
              </LiquidGlassButton>
            </Show>

            <Show when="signed-in">
              <LiquidGlassButton onClick={handleAuth}>
                ACCESS MAINFRAME
              </LiquidGlassButton>
            </Show>
          </div>

          <div className="absolute top-8 left-8 border-t-2 border-l-2 border-primary/50 w-16 h-16 pointer-events-none" />
          <div className="absolute bottom-8 right-8 border-b-2 border-r-2 border-primary/50 w-16 h-16 pointer-events-none" />
        </div>
      </ClerkLoaded>
    </>
  );
}
