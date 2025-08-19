'use client';

import { useCallback, ReactNode, JSX, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

// Import and register languages
import 'highlight.js/lib/languages/javascript';
import 'highlight.js/lib/languages/typescript';
import 'highlight.js/lib/languages/css';
import 'highlight.js/lib/languages/bash';
import 'highlight.js/lib/languages/json';

// Configure rehype-highlight with language aliases
const rehypeHighlightOptions = {
  aliases: { 
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript'
  },
  ignoreMissing: true
};

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

// Type for ReactMarkdown component props that extends HTML attributes
type ComponentProps<T extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[T] & {
    className?: string;
    children?: ReactNode;
  };

interface MarkdownRendererProps {
  content: string;
  className?: string;
  [key: string]: unknown;
}

export function MarkdownRenderer({ 
  content, 
  className,
  ...props 
}: MarkdownRendererProps) {
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy code');
    }
  }, []);

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling when interacting with code blocks
      if ((e.target as HTMLElement).closest('pre, code')) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  if (!content) return null;
  
  return (
    <div className={cn('prose dark:prose-invert max-w-none prose-sm prose-pre:p-0 prose-code:before:hidden prose-code:after:hidden', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeHighlight, rehypeHighlightOptions]]}
        components={{
          code: ({ inline, className, children, ...props }: CodeProps) => {
            const codeContent = String(children).replace(/\n$/, '');
            
            if (inline) {
              return (
                <code className={cn('px-1.5 py-0.5 rounded bg-muted text-sm', className)} {...props}>
                  {children}
                </code>
              );
            }
            
            const language = className?.replace(/language-/, '') || 'plaintext';
            const isCopied = copiedText === codeContent;
            
            return (
              <div className="relative my-4 group rounded-lg overflow-hidden">
                <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
                  <span className="text-xs font-mono text-muted-foreground">
                    {language}
                  </span>
                  <Button
                    ref={copyButtonRef}
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs font-normal transition-colors hover:bg-muted/80"
                    onClick={() => handleCopy(codeContent)}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleCopy(codeContent);
                    }}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <pre className={cn(
                    'm-0 p-4 text-sm leading-relaxed overflow-x-auto',
                    'bg-muted/30 dark:bg-muted/20',
                    className
                  )}>
                    <code className={cn('font-mono', className)} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              </div>
            );
          },
          pre: ({ className, children, ...props }: ComponentProps<'pre'>) => (
            <div className={cn('my-4', className)} {...props}>
              {children}
            </div>
          ),
          a: ({ className, children, href, ...props }: ComponentProps<'a'>) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={cn(
                  'text-primary hover:underline break-words',
                  'underline-offset-4 decoration-1',
                  'transition-colors duration-200',
                  isExternal && 'inline-flex items-center gap-1',
                  className
                )}
                {...props}
              >
                {children}
                {isExternal && (
                  <svg
                    className="w-3 h-3 ml-0.5 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </a>
            );
          },
          table: ({ className, children }: ComponentProps<'table'>) => (
            <div className="w-full overflow-x-auto my-4 rounded-lg border border-border">
              <table className={cn('w-full border-collapse text-sm', className)}>
                {children}
              </table>
            </div>
          ),
          th: ({ className, children }: ComponentProps<'th'>) => (
            <th className={cn('border border-border bg-muted/50 p-2 text-left', className)}>
              {children}
            </th>
          ),
          td: ({ className, children }: ComponentProps<'td'>) => (
            <td className={cn('border border-border p-2', className)}>
              {children}
            </td>
          ),
          blockquote: ({ className, children }: ComponentProps<'blockquote'>) => (
            <blockquote
              className={cn(
                'border-l-4 border-muted-foreground/50 pl-4 my-4 not-italic',
                'bg-muted/20 dark:bg-muted/10 py-2 px-4 rounded-r-lg',
                'text-muted-foreground',
                className
              )}
            >
              {children}
            </blockquote>
          ),
          // Add responsive images with Next.js Image component
          img: ({ className, alt, src, ...props }: ComponentProps<'img'>) => (
            <div className="my-4 overflow-hidden rounded-lg border border-border">
              <div className="relative w-full aspect-video">
                <Image
                  src={src || ''}
                  alt={alt || ''}
                  fill
                  className={cn('object-contain', className)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  {...props}
                />
              </div>
              {alt && (
                <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border bg-muted/30">
                  {alt}
                </div>
              )}
            </div>
          ),
        }}
        {...props}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}