import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import Projects from "@/pages/projects";
import DashboardLayout from './dashboard-layout';
import { useState } from "react";

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
    <div>
      
    </div>
      <header className="relative w-full flex flex-col items-center justify-center min-h-screen">
        
        {/* Signed Out View */}
        <Show when="signed-out">
          <div
            className="relative w-full flex items-center justify-center mt-12"
            onMouseMove={handleMouseMove}
          >
            {/* Interactive holo background */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,255,255,0.2), rgba(255,0,255,0.1), transparent 80%)`,
                filter: "blur(120px)",
                transition: "background 0.05s",
              }}
            />

            {/* Buttons */}
            <div className="relative flex flex-col md:flex-row gap-6 items-center justify-center z-10">
              <SignInButton>
                <div className="px-8 py-3 font-mono text-sm md:text-base tracking-widest text-primary border border-primary/50 bg-background/20 backdrop-blur-md hover:bg-background/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:scale-105 transition-all duration-300 rounded-lg drop-shadow-neon">
                  SIGN IN
                </div>
              </SignInButton>

              <SignUpButton>
                <div className="px-8 py-3 font-mono text-sm md:text-base tracking-widest text-pink-500 border border-pink-500/50 bg-background/20 backdrop-blur-md hover:bg-background/40 hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] hover:scale-105 transition-all duration-300 rounded-lg drop-shadow-neon">
                  SIGN UP
                </div>
              </SignUpButton>
            </div>
          </div>
        </Show>

        {/* Signed In View */}
        <Show when="signed-in">
          <UserButton />
          <Projects />
        </Show>

      </header>
    </>
  );
}

export default App;