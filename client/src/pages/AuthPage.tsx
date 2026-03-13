import { Show, SignInButton, SignUpButton } from "@clerk/react";
import { Redirect } from "wouter";

function App() {
  return (
    <header className="min-h-screen w-full flex items-center justify-center">
      <Show when="signed-out">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <SignInButton>
            <button className="px-8 py-3 font-mono text-sm md:text-base tracking-widest text-primary border border-primary/50 bg-background/30 backdrop-blur-lg hover:bg-background/50 transition-all duration-300 rounded-xl">
              SIGN IN
            </button>
          </SignInButton>

          <SignUpButton>
            <button className="px-8 py-3 font-mono text-sm md:text-base tracking-widest text-pink-500 border border-pink-500/50 bg-background/30 backdrop-blur-lg hover:bg-background/50 transition-all duration-300 rounded-xl">
              SIGN UP
            </button>
          </SignUpButton>
        </div>
      </Show>

      <Show when="signed-in">
        <Redirect to="/projects" />
      </Show>
    </header>
  );
}

export default App;