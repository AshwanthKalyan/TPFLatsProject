import { useEffect, useState } from "react";
import { Show, SignInButton, SignUpButton, useClerk, useUser } from "@clerk/react";
import { Redirect, useLocation } from "wouter";

const NITT_EMAIL_REGEX = /^[a-z0-9]+@nitt\.edu$/i;

function isNittEmail(email: string | null | undefined) {
  return !!email && NITT_EMAIL_REGEX.test(email);
}

function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [, setLocation] = useLocation();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;
  const isNitt = isNittEmail(primaryEmail);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || isNitt) {
      return;
    }

    const signOutAndRedirect = async () => {
      try {
        await signOut();
      } finally {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("nittAuthError", "1");
        }
        setLocation("/?auth=nitt", { replace: true });
      }
    };

    void signOutAndRedirect();
  }, [isLoaded, isSignedIn, isNitt, signOut, setLocation]);

  return (
    <header className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">

      {/* Mouse Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(400px at ${mouse.x}px ${mouse.y}px, rgba(0,255,255,0.25), transparent 80%)`,
        }}
      />

      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,200,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-500 blur-[200px] opacity-30 rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-400 blur-[200px] opacity-30 rounded-full bottom-[-100px] right-[-100px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10">

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-mono tracking-widest text-cyan-300 drop-shadow-[0_0_20px_cyan]">
          THE PRODUCT FOLKS - NITT
        </h1>

        <div className="inline-block border border-primary/50 bg-background/50 backdrop-blur-sm px-4 py-1.5 text-primary font-mono text-sm tracking-widest mb-8 brutal-shadow">
            ENSURE YOU USE YOUR NITT WEBMAIL
        </div>

        <Show when="signed-out">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">

            <SignInButton>
              <button className="px-10 py-3 font-mono tracking-widest text-cyan-300 border border-cyan-400 bg-black/40 backdrop-blur-lg rounded-xl hover:bg-cyan-400/10 hover:shadow-[0_0_20px_cyan] transition-all duration-300">
                SIGN IN
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="px-10 py-3 font-mono tracking-widest text-pink-400 border border-pink-500 bg-black/40 backdrop-blur-lg rounded-xl hover:bg-pink-500/10 hover:shadow-[0_0_20px_pink] transition-all duration-300">
                SIGN UP
              </button>
            </SignUpButton>

          </div>
        </Show>

        <Show when="signed-in">
          {isNitt ? <Redirect to="/projects" /> : null}
        </Show>
      </div>

      {/* Scanlines Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-10 z-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />

    </header>
  );
}

export default App;
