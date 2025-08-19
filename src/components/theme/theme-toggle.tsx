'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const animationRef = React.useRef<number>();
  const { theme, setTheme } = useTheme();
  const cleanupRef = React.useRef<() => void>();

  // Set up cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  // Set mounted state on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Set up cleanup function
  React.useEffect(() => {
    cleanupRef.current = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    // Clear any existing animations to prevent overlap
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsAnimating(true);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Use requestAnimationFrame for smoother animation
    animationRef.current = requestAnimationFrame(() => {
      setTheme(newTheme);
      // Shorter animation duration for a more subtle effect
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    });
  };

  // Prevent rendering the button until mounted on the client
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        aria-label="Toggle theme"
      >
        <div className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }


  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        className="relative"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {/* Smoother, more subtle overlay */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none bg-background ${isAnimating ? 'opacity-20' : 'opacity-0'}`}
        style={{
          transition: 'opacity 150ms ease-out',
          willChange: 'opacity',
        }}
      />
    </>
  );
}
