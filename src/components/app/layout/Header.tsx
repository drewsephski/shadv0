import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Share } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            v1
          </h1>
        </div>
        <Badge variant="secondary" className="text-xs">
          AI Code Generator
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.reload()}
          className="gap-2 hidden sm:flex"
        >
          <MessageSquare className="size-4" />
          New Chat
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
          <Share className="size-4" />
          Share
        </Button>
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
  );
}
