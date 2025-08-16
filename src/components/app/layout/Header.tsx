import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Share, User } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            v0
          </h1>
        </div>
        <Badge variant="secondary" className="text-xs">
          AI Code Generator
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <MessageSquare className="size-4" />
          New Chat
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share className="size-4" />
          Share
        </Button>
        <Button size="sm" className="gap-2">
          <User className="size-4" />
          Login
        </Button>
      </div>
    </header>
  );
}
