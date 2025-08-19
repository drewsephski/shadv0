import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { Experimental_GeneratedImage } from 'ai';

export type ImageProps = Omit<Experimental_GeneratedImage, 'uint8Array'> & {
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export const GeneratedImage = ({
  base64,
  mediaType,
  ...props
}: ImageProps) => (
  <Image
    {...props}
    alt={props.alt || 'Generated image'}
    className={cn(
      'h-auto max-w-full overflow-hidden rounded-md',
      props.className
    )}
    src={`data:${mediaType};base64,${base64}`}
    width={props.width || 512}
    height={props.height || 512}
  />
);
