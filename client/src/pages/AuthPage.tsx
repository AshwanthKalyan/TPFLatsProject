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
            className="relative w-full flex items-center justify-center mt-12 h-96" // set a visible height
            onMouseMove={handleMouseMove}
          >
            {/* Interactive holo background */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,255,255,0.3), rgba(255,0,255,0.2) 40%, rgba(128,0,255,0.1) 70%, transparent 100%)
                `,
                filter: "blur(150px)",
                transition: "background 0.05s",
              }}
            />

            {/* Buttons */}
            <div className="relative flex flex-col md:flex-row gap-6 items-center justify-center z-10">
              <SignInButton>
                <div className="px-8 py-3 font-mono text-sm md:text-base tracking-widest text-primary border border-primary/50 bg-background/30 backdrop-blur-lg hover:bg-background/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] hover:scale-105 transition-all duration-300 rounded-xl drop-shadow-[0_0_20px_cyan]">
                  SIGN IN
                </div>
              </SignInButton>

              <SignUpButton>
                <div className="px-8 py-3 font-mono text-sm md:text-base tracking-widest text-pink-500 border border-pink-500/50 bg-background/30 backdrop-blur-lg hover:bg-background/50 hover:shadow-[0_0_30px_rgba(255,0,255,0.7)] hover:scale-105 transition-all duration-300 rounded-xl drop-shadow-[0_0_20px_magenta]">
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