import { cn } from '@/lib/utils';
import BotIcon from '@/components/ui/bot-icon';
import UserIcon from '@/components/ui/user-icon';
import type { HTMLAttributes } from 'react';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: 'user' | 'assistant';
};

export const Message = ({ children, className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'flex items-start gap-4',
      from === 'user' && 'justify-end',
      className
    )}
    {...props}
  >
    {from === 'assistant' && (
      <div className="size-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
        <BotIcon className="size-5" />
      </div>
    )}
    <div
      className={cn(
        'max-w-[80%] rounded-lg p-3 text-sm',
        from === 'user'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {children}
    </div>
    {from === 'user' && (
      <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
        <UserIcon className="size-5" />
      </div>
    )}
  </div>
);

export const MessageContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
