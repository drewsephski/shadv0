import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { MODELS } from "@/constants/models";

type ModelSelectorProps = {
  model: string;
  onModelChange: (model: string) => void;
};

export function ModelSelector({ model, onModelChange }: ModelSelectorProps) {
  return (
    <div className="relative group">
      <Select value={model} onValueChange={onModelChange}>
        <SelectTrigger className="w-[180px] text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div>
              <div className="font-medium">{MODELS[model]?.name}</div>
              <div className="text-xs text-muted-foreground">
                {MODELS[model]?.context} context
              </div>
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="w-[320px]">
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Free Models</p>
            {Object.entries(MODELS).map(([key, info]) => (
              <SelectItem 
                key={key} 
                value={key} 
                className={`group/item ${key === model ? 'bg-accent' : ''}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`w-2 h-2 rounded-full ${key === model ? 'bg-green-500' : 'bg-muted'}`}></div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${key === model ? 'text-primary' : ''}`}>
                      {info.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{info.context}K</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    {info.description}
                  </div>
                </div>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
