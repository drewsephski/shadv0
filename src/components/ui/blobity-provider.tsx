"use client";

import { useEffect } from 'react';
import { useInteractiveBlob } from 'react-interactive-blob';
import { useTheme } from 'next-themes';

export function BlobityProvider() {
  const { theme } = useTheme();
  const blob = useInteractiveBlob({
    // options
  });

  useEffect(() => {
    if (theme === 'dark') {
      blob.updateOptions({
        color: '#2a2a2a',
        dotColor: '#3a3a3a',
      });
    } else {
      blob.updateOptions({
        color: '#e0e0e0',
        dotColor: '#d0d0d0',
      });
    }
  }, [theme, blob]);

  return null;
}

export default BlobityProvider;