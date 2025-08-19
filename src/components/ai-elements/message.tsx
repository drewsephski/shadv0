import { cn } from '@/lib/utils';
import BotIcon from '@/components/ui/bot-icon';
import UserIcon from '@/components/ui/user-icon';
import { format } from 'date-fns';
import type { HTMLAttributes } from 'react';

type MessageVariant = 'user' | 'assistant';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: MessageVariant;
  timestamp?: Date;
  model?: string;
};

const getVariantStyles = (variant: MessageVariant) => {
  const baseStyles = 'p-4 rounded-xl text-sm relative';
  
  switch (variant) {
    case 'user':
      return cn(
        baseStyles,
        'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-none',
        'shadow-md hover:shadow-lg transition-all duration-300',
        'max-w-[85%] md:max-w-[75%]',
        'backdrop-blur-sm'
      );
    case 'assistant':
      return cn(
        baseStyles,
        'bg-gradient-to-br from-background to-muted/30 text-foreground rounded-tl-none',
        'border border-border/40 shadow-sm hover:shadow-md transition-all duration-300',
        'max-w-[90%] md:max-w-[80%]',
        'backdrop-blur-sm'
      );
    default:
      return baseStyles;
  }
};

export const Message = ({
  children,
  className,
  from,
  timestamp = new Date(),
  model,
  ...props
}: MessageProps) => {
  const formattedTime = format(timestamp, 'h:mm a');
  const isAssistant = from === 'assistant';

  return (
    <div
      className={cn(
        'group w-full',
        'flex items-start gap-3',
        isAssistant ? 'justify-start' : 'justify-end',
        className
      )}
      {...props}
    >
      {isAssistant && (
        <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <BotIcon className="size-4" />
        </div>
      )}
      
      <div className={cn('flex flex-col gap-1', isAssistant ? 'items-start' : 'items-end')}>
        <div className={cn('flex items-center gap-2', isAssistant ? 'order-1' : 'order-2')}>
          {isAssistant && model && (
            <span className="text-xs text-muted-foreground font-medium">
              {model}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formattedTime}
          </span>
        </div>
        
        <div className={getVariantStyles(from)}>
          {children}
        </div>
      </div>

      {!isAssistant && (
        <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <UserIcon className="size-4" />
        </div>
      )}
    </div>
  );
};

export const MessageContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
