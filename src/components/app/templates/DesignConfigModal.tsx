"use client"

import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalActions } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  DesignSystemConfig,
  DesignConfigModalProps,
  ColorPreset,
  FontPreset,
  ColorPresetOption,
  FontPresetOption,
  ColorPalette,
  TypographyConfig
} from '@/app/types'

// Color presets
const colorPresets: ColorPresetOption[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: {
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
    }
  },
  {
    id: 'green',
    name: 'Forest Green',
    colors: {
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
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
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
  }
]

// Font presets
const fontPresets: FontPresetOption[] = [
  {
    id: 'modern',
    name: 'Modern',
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
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    typography: {
      fontFamily: 'lato',
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
    }
  }
]

// Default configuration
const getDefaultConfig = (): DesignSystemConfig => ({
  mode: 'light',
  colors: colorPresets[0].colors as ColorPalette,
  typography: fontPresets[0].typography as TypographyConfig,
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
})

export function DesignConfigModal({
  isOpen,
  onClose,
  onSave,
  initialConfig
}: DesignConfigModalProps) {
  const [config, setConfig] = useState<DesignSystemConfig>(getDefaultConfig())
  const [activeTab, setActiveTab] = useState('colors')

  useEffect(() => {
    if (initialConfig) {
      setConfig({ ...getDefaultConfig(), ...initialConfig })
    }
  }, [initialConfig, isOpen])

  const handleSave = () => {
    onSave(config)
    onClose()
  }

  const handleReset = () => {
    setConfig(getDefaultConfig())
  }

  const updateColors = (preset: ColorPresetOption) => {
    setConfig(prev => ({
      ...prev,
      colors: { ...prev.colors, ...preset.colors }
    }))
  }

  const updateTypography = (preset: FontPresetOption) => {
    setConfig(prev => ({
      ...prev,
      typography: { ...prev.typography, ...preset.typography }
    }))
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="text-2xl font-bold">Customize Design System</ModalTitle>
          <ModalDescription>
            Configure your design system preferences to generate perfectly styled components
          </ModalDescription>
        </ModalHeader>

        <div className="px-6 pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Color Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPresets.map((preset) => (
                    <Card
                      key={preset.id}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        JSON.stringify(config.colors) === JSON.stringify(preset.colors) &&
                        "ring-2 ring-primary"
                      )}
                      onClick={() => updateColors(preset)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{preset.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.colors.accent }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.colors.secondary }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Mode</h3>
                <div className="flex gap-2">
                  {(['light', 'dark'] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={config.mode === mode ? 'default' : 'outline'}
                      onClick={() => setConfig(prev => ({ ...prev, mode }))}
                      className="capitalize"
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Font Presets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fontPresets.map((preset) => (
                    <Card
                      key={preset.id}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        config.typography.fontFamily === preset.typography.fontFamily &&
                        "ring-2 ring-primary"
                      )}
                      onClick={() => updateTypography(preset)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{preset.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="text-lg font-medium mb-2"
                          style={{ fontFamily: preset.typography.fontFamily }}
                        >
                          {preset.typography.fontFamily}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Sample text showing the font style
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Component Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Button Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(['rounded', 'square', 'pill', 'ghost', 'outline'] as const).map((variant) => (
                          <Button
                            key={variant}
                            variant={config.components.button === variant ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setConfig(prev => ({
                              ...prev,
                              components: { ...prev.components, button: variant }
                            }))}
                            className="capitalize"
                          >
                            {variant}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Card Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(['flat', 'elevated', 'glass', 'bordered'] as const).map((variant) => (
                          <Button
                            key={variant}
                            variant={config.components.card === variant ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setConfig(prev => ({
                              ...prev,
                              components: { ...prev.components, card: variant }
                            }))}
                            className="capitalize"
                          >
                            {variant}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Sample Button</h4>
                      <Button
                        style={{
                          backgroundColor: config.colors.primary,
                          borderRadius: config.spacing.borderRadius[config.components.button === 'pill' ? 'full' : 'lg']
                        }}
                      >
                        Sample Button
                      </Button>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Sample Card</h4>
                      <Card
                        className={cn(
                          "p-4 max-w-sm",
                          config.components.card === 'elevated' && "shadow-lg",
                          config.components.card === 'glass' && "backdrop-blur-sm bg-white/20",
                          config.components.card === 'bordered' && "border-2"
                        )}
                        style={{
                          backgroundColor: config.components.card === 'glass' ? 'rgba(255,255,255,0.2)' : config.colors.surface,
                          borderColor: config.colors.border
                        }}
                      >
                        <h5
                          className="font-semibold mb-2"
                          style={{
                            color: config.colors.text,
                            fontFamily: config.typography.fontFamily
                          }}
                        >
                          Sample Card Title
                        </h5>
                        <p
                          className="text-sm"
                          style={{
                            color: config.colors.textSecondary,
                            fontFamily: config.typography.fontFamily
                          }}
                        >
                          This is a sample card to preview your design system.
                        </p>
                      </Card>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Color Palette</h4>
                      <div className="grid grid-cols-5 gap-3">
                        {Object.entries(config.colors).map(([key, color]) => (
                          <div key={key} className="text-center">
                            <div
                              className="w-12 h-12 rounded-lg mx-auto mb-1 border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <div className="text-xs text-muted-foreground capitalize">
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <ModalActions>
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Apply Configuration
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  )
}