"use client";

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Type,
  Settings,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DesignSystemConfig, ColorPalette, TypographyConfig } from '@/app/types';

interface DesignControlsPanelProps {
  designConfig: DesignSystemConfig;
  onDesignChange: (config: DesignSystemConfig) => void;
  onPropertyChange: (property: string, value: string) => void;
  className?: string;
}

const colorPresets = {
  blue: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#06B6D4',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B'
  },
  green: {
    primary: '#10B981',
    secondary: '#047857',
    accent: '#34D399',
    background: '#FFFFFF',
    surface: '#F0FDF4',
    text: '#14532D',
    textSecondary: '#22C55E',
    border: '#BBF7D0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A855F7',
    background: '#FFFFFF',
    surface: '#FAF5FF',
    text: '#581C87',
    textSecondary: '#7C3AED',
    border: '#E9D5FF',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B'
  }
};

const fontPresets = {
  modern: {
    fontFamily: 'inter'
  },
  classic: {
    fontFamily: 'lato'
  }
};

export function DesignControlsPanel({
  designConfig,
  onDesignChange,
  onPropertyChange,
  className
}: DesignControlsPanelProps) {
  const [activeTab, setActiveTab] = useState('colors');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle color preset selection
  const handleColorPreset = useCallback((preset: keyof typeof colorPresets) => {
    const newConfig = {
      ...designConfig,
      colors: { ...colorPresets[preset] }
    };
    onDesignChange(newConfig);
  }, [designConfig, onDesignChange]);

  // Handle font preset selection
  const handleFontPreset = useCallback((preset: keyof typeof fontPresets) => {
    const newConfig = {
      ...designConfig,
      typography: {
        ...designConfig.typography,
        fontFamily: fontPresets[preset].fontFamily as TypographyConfig['fontFamily']
      }
    };
    onDesignChange(newConfig);
  }, [designConfig, onDesignChange]);

  // Handle individual color change
  const handleColorChange = useCallback((colorKey: keyof ColorPalette, value: string) => {
    onPropertyChange(`colors.${colorKey}`, value);
  }, [onPropertyChange]);

  // Handle typography change
  const handleTypographyChange = useCallback((property: string, value: string) => {
    onPropertyChange(`typography.${property}`, value);
  }, [onPropertyChange]);

  // Handle component variant change
  const handleComponentChange = useCallback((component: string, value: string) => {
    onPropertyChange(`components.${component}`, value);
  }, [onPropertyChange]);

  // Handle spacing change
  const handleSpacingChange = useCallback((property: string, value: string) => {
    onPropertyChange(`spacing.${property}`, value);
  }, [onPropertyChange]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    const defaultConfig: DesignSystemConfig = {
      mode: 'light',
      colors: colorPresets.blue,
      typography: {
        fontFamily: 'inter',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      components: {
        button: 'rounded',
        input: 'default',
        card: 'elevated',
        modal: 'default'
      },
      spacing: {
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem'
        },
        borderRadius: {
          sm: '0.125rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          full: '9999px'
        }
      },
      animations: {
        enabled: true,
        duration: 'normal',
        easing: 'ease'
      }
    };
    onDesignChange(defaultConfig);
  }, [onDesignChange]);

  // Copy CSS variables
  const handleCopyCSS = useCallback(() => {
    const cssVars = Object.entries(designConfig.colors)
      .map(([key, value]) => `  --color-${key}: ${value};`)
      .join('\n');

    const typographyVars = [
      `  --font-family-primary: ${designConfig.typography.fontFamily};`,
      ...Object.entries(designConfig.typography.fontSize)
        .map(([key, value]) => `  --font-size-${key}: ${value};`),
      ...Object.entries(designConfig.typography.fontWeight)
        .map(([key, value]) => `  --font-weight-${key}: ${value};`)
    ].join('\n');

    const spacingVars = [
      ...Object.entries(designConfig.spacing.spacing)
        .map(([key, value]) => `  --spacing-${key}: ${value};`),
      ...Object.entries(designConfig.spacing.borderRadius)
        .map(([key, value]) => `  --border-radius-${key}: ${value};`)
    ].join('\n');

    const css = `:root {\n${cssVars}\n${typographyVars}\n${spacingVars}\n}`;

    navigator.clipboard.writeText(css);
  }, [designConfig]);

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Palette className="size-4" />
            Design Controls
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleCopyCSS}>
              <Copy className="size-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 mx-2 mt-2">
            <TabsTrigger value="colors" className="text-xs">
              <Palette className="size-3 mr-1" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">
              <Type className="size-3 mr-1" />
              Type
            </TabsTrigger>
            <TabsTrigger value="components" className="text-xs">
              <Settings className="size-3 mr-1" />
              Style
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="p-3 space-y-4">
            {/* Color Presets */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Presets</Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(colorPresets).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleColorPreset(key as keyof typeof colorPresets)}
                    className={cn(
                      "p-2 h-auto flex flex-col gap-1",
                      JSON.stringify(designConfig.colors) === JSON.stringify(preset) &&
                      "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex gap-0.5">
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                    <span className="text-xs capitalize">{key}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Individual Colors */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Individual Colors</Label>
              {Object.entries(designConfig.colors).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                      className="flex-1 text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="p-3 space-y-4">
            {/* Font Presets */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Font Family</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(fontPresets).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant={designConfig.typography.fontFamily === preset.fontFamily ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFontPreset(key as keyof typeof fontPresets)}
                    className="text-xs"
                  >
                    {preset.fontFamily}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Font Size Controls */}
            {showAdvanced && (
              <div className="space-y-3">
                <Label className="text-xs font-medium">Font Sizes</Label>
                {Object.entries(designConfig.typography.fontSize).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Label className="text-xs w-12">{key}:</Label>
                    <Input
                      value={value}
                      onChange={(e) => handleTypographyChange(`fontSize.${key}`, e.target.value)}
                      className="flex-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="p-3 space-y-4">
            {/* Button Variants */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Button Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['rounded', 'square', 'pill', 'ghost', 'outline'] as const).map((variant) => (
                  <Button
                    key={variant}
                    variant={designConfig.components.button === variant ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleComponentChange('button', variant)}
                    className="text-xs capitalize"
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>

            {/* Card Variants */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Card Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['flat', 'elevated', 'glass', 'bordered'] as const).map((variant) => (
                  <Button
                    key={variant}
                    variant={designConfig.components.card === variant ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleComponentChange('card', variant)}
                    className="text-xs capitalize"
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>

            {/* Spacing Controls */}
            {showAdvanced && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-xs font-medium">Spacing</Label>
                  {Object.entries(designConfig.spacing.spacing).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Label className="text-xs w-12">{key}:</Label>
                      <Input
                        value={value}
                        onChange={(e) => handleSpacingChange(`spacing.${key}`, e.target.value)}
                        className="flex-1 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}