import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { TrashIcon, EyeIcon, History } from 'lucide-react';

interface Version {
  id: string;
  htmlContent: string;
  timestamp: number;
  description?: string;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: Version[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (htmlContent: string) => void;
  // onCompare: (id1: string, id2: string) => void; // Future: for comparing versions
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  versions,
  onRestore,
  onDelete,
  onView,
  // onCompare,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-5" /> Version History
          </DialogTitle>
          <DialogDescription>
            Browse, restore, or delete past versions of your generated UI.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto pr-4">
          {versions.length === 0 ? (
            <p className="text-center text-muted-foreground mt-8">No versions saved yet.</p>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div key={version.id} className="border rounded-md p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {version.description || `Version from ${format(new Date(version.timestamp), 'PPP p')}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(version.timestamp), 'PPP p')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(version.htmlContent)}
                      title="View Version"
                    >
                      <EyeIcon className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(version.id)}
                      title="Restore Version"
                    >
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(version.id)}
                      title="Delete Version"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};