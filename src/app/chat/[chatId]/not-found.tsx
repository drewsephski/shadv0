import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Chat Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The chat you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Button asChild>
        <Link href="/chat/new" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Start a new chat
        </Link>
      </Button>
    </div>
  );
}
