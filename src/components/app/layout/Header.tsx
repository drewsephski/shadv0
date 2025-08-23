import { Button } from "@/components/ui/button";
import { MessageSquare, Share } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onNewChat?: () => void;
}

export function Header({ onNewChat }: HeaderProps = {}) {
  const router = useRouter();

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border-/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 h-16 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {/* TODO: Replace with a proper logo */}
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-primary-foreground"><path d="M10 3h4v4h-4z"/><path d="M7 17h10v4H7z"/><path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2z"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/></svg>
            </div>
            <h1 className="text-xl font-extrabold leading-[1.2] text-foreground hover:opacity-80 transition-opacity">
              DEEPSEEKDREW
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-4 ml-6">
            <Link href="/features" className="text-sm font-medium text-black hover:text-foreground transition-colors bg-blue-300 hover:bg-blue-400 px-3 py-2 rounded-sm">
              Features
            </Link>
          </nav>
        </div>
        
        
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="gap-2 hidden sm:flex"
          >
            
            <MessageSquare className="size-4" />
            New Chat
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
            <Share className="size-4" />
            Share
          </Button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <ThemeToggle />
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
    </>
  );
}
