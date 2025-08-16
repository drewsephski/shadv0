import { Button } from "@/components/ui/button";
import { ModelSelector } from "../ui/ModelSelector";

type HeaderProps = {
  model: string;
  onModelChange: (model: string) => void;
};

export function Header({ model, onModelChange }: HeaderProps) {
  return (
    <header className="border-b p-3 h-16 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-xl font-bold">v0</h1>
      <div className="flex items-center gap-4">
        <ModelSelector model={model} onModelChange={onModelChange} />
        <Button variant="outline">Share</Button>
        <Button>Login</Button>
      </div>
    </header>
  );
}
