'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageIcon, X } from 'lucide-react';
import { Icons } from '../icons';

export interface FileWithPreview extends File {
  preview?: string;
}

interface BaseProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>, files?: FileWithPreview[]) => void;
  isLoading?: boolean;
  onFileUpload?: (files: FileWithPreview[]) => void;
  uploadedFiles?: FileWithPreview[];
  onRemoveFile?: (index: number) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

type ChatInputProps = BaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'onChange'>;

export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  ({ className, onSubmit, isLoading, onFileUpload, uploadedFiles = [], onRemoveFile, value = '', onChange, placeholder, ...props }, ref) => {
    const [files, setFiles] = React.useState<FileWithPreview[]>(uploadedFiles);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(e, files);
        setFiles([]); // Clear files after submit
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        if (onFileUpload) {
          onFileUpload([...files, ...newFiles]);
        }
      }
      // Reset the input value to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    };

    const handleRemoveFile = (index: number) => {
      const fileToRemove = files[index];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      if (onRemoveFile) {
        onRemoveFile(index);
      }
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <form onSubmit={handleSubmit} className="relative">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  {file.preview && file.type.startsWith('image/') ? (
                    <div className="relative group">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-muted rounded-lg p-2 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <Textarea
                className={cn(
                  'min-h-[60px] w-full resize-none bg-transparent pr-12 pl-4 py-3 focus-within:outline-none sm:text-sm',
                  'border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0',
                  className
                )}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.closest('form');
                    if (form) {
                      form.requestSubmit();
                    }
                  }
                }}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Upload image</span>
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  disabled={isLoading || (!value && files.length === 0)}
                >
                  {isLoading ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';
