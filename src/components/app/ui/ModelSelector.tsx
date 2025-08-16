import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const MODEL_INFO = {
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: 'Fast and capable model from OpenAI, great balance of speed and quality',
    context: '16K',
  },
  'llama-3.1-8b': {
    name: 'Llama 3.1 8B',
    description: 'Efficient model from Meta, good for most tasks',
    context: '8K',
  },
  'llama-3.1-70b': {
    name: 'Llama 3.1 70B',
    description: 'More powerful but slower model from Meta',
    context: '8K',
  },
  'mixtral-8x7b': {
    name: 'Mixtral 8x7B',
    description: 'High-quality model from Mistral AI',
    context: '32K',
  },
  'gemma-7b': {
    name: 'Gemma 7B',
    description: 'Lightweight model from Google',
    context: '8K',
  },
  'qwen-7b': {
    name: 'Qwen 7B',
    description: 'Model from Alibaba Cloud',
    context: '8K',
  },
  'glm-4.5': {
    name: 'GLM-4.5',
    description: 'Model from Zhipu AI',
    context: '128K',
  },
  'kimi-k2': {
    name: 'Kimi K2',
    description: 'Model from Moonshot AI',
    context: '128K',
  },
} as const;

type ModelSelectorProps = {
  model: string;
  onModelChange: (model: string) => void;
};

export function ModelSelector({ model, onModelChange }: ModelSelectorProps) {
  return (
    <div className="relative group">
      <Select value={model} onValueChange={onModelChange}>
        <SelectTrigger className="w-[140px] text-sm flex items-center justify-between">
          <div>
            <div className="font-medium">{MODEL_INFO[model as keyof typeof MODEL_INFO]?.name}</div>
            <div className="text-xs text-muted-foreground">
              {MODEL_INFO[model as keyof typeof MODEL_INFO]?.context} context
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="w-[300px]">
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Free Models</p>
            {Object.entries(MODEL_INFO).map(([key, info]) => (
              <SelectItem key={key} value={key} className="group/item">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{info.name}</span>
                    <span className="text-xs text-muted-foreground">{info.context}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {info.description}
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
