"use client"

import { useState, useCallback } from 'react'
import { DesignSystemConfig, ColorPalette, TypographyConfig } from '@/app/types'

// Default color palettes
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
}

// Default typography configurations
const typographyPresets = {
  modern: {
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
  classic: {
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

// Get default configuration
const getDefaultConfig = (): DesignSystemConfig => ({
  mode: 'light',
  colors: colorPresets.blue as ColorPalette,
  typography: typographyPresets.modern as TypographyConfig,
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

export function useDesignConfig() {
  const [config, setConfig] = useState<DesignSystemConfig>(getDefaultConfig())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const updateConfig = useCallback((newConfig: DesignSystemConfig) => {
    setConfig(newConfig)
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(getDefaultConfig())
  }, [])

  const openConfigModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeConfigModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const saveConfig = useCallback((newConfig: DesignSystemConfig) => {
    setConfig(newConfig)
    setIsModalOpen(false)
  }, [])

  // Generate CSS variables from config
  const generateCSSVariables = useCallback(() => {
    const cssVars: Record<string, string> = {}

    // Color variables
    Object.entries(config.colors).forEach(([key, value]) => {
      cssVars[`--color-${key}`] = value
    })

    // Typography variables
    cssVars['--font-family-primary'] = config.typography.fontFamily
    Object.entries(config.typography.fontSize).forEach(([key, value]) => {
      cssVars[`--font-size-${key}`] = value
    })
    Object.entries(config.typography.fontWeight).forEach(([key, value]) => {
      cssVars[`--font-weight-${key}`] = value.toString()
    })
    Object.entries(config.typography.lineHeight).forEach(([key, value]) => {
      cssVars[`--line-height-${key}`] = value.toString()
    })

    // Spacing variables
    Object.entries(config.spacing.spacing).forEach(([key, value]) => {
      cssVars[`--spacing-${key}`] = value
    })
    Object.entries(config.spacing.borderRadius).forEach(([key, value]) => {
      cssVars[`--border-radius-${key}`] = value
    })

    return cssVars
  }, [config])

  // Generate CSS class names based on component variants
  const getComponentClasses = useCallback((componentType: keyof typeof config.components) => {
    const variant = config.components[componentType]

    const baseClasses: Record<string, string> = {
      button: {
        rounded: 'rounded-lg',
        square: 'rounded-none',
        pill: 'rounded-full',
        ghost: 'bg-transparent border border-current text-current hover:bg-current hover:text-white',
        outline: 'border border-current bg-transparent hover:bg-current hover:text-white'
      },
      card: {
        flat: '',
        elevated: 'shadow-lg',
        glass: 'backdrop-blur-sm bg-white/20',
        bordered: 'border-2'
      },
      input: {
        default: 'border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        floating: 'border-0 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent',
        minimal: 'border-0 border-b border-gray-300 focus:border-blue-500 bg-transparent',
        material: 'border-0 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent pt-4'
      },
      modal: {
        default: 'rounded-lg',
        fullscreen: 'rounded-none w-screen h-screen',
        slide: 'rounded-lg animate-slide-in',
        fade: 'rounded-lg animate-fade-in'
      }
    }

    return baseClasses[componentType]?.[variant] || ''
  }, [config.components])

  // Generate prompt for AI based on configuration
  const generatePromptContext = useCallback((templatePrompt: string) => {
    const context = `
Design System Configuration:
- Mode: ${config.mode}
- Primary Color: ${config.colors.primary}
- Secondary Color: ${config.colors.secondary}
- Accent Color: ${config.colors.accent}
- Font Family: ${config.typography.fontFamily}
- Button Style: ${config.components.button}
- Card Style: ${config.components.card}
- Animations: ${config.animations.enabled ? 'Enabled' : 'Disabled'}

Please generate the component using these design specifications and maintain consistency with the provided design system.

Original prompt: ${templatePrompt}
    `.trim()

    return context
  }, [config])

  return {
    config,
    isModalOpen,
    updateConfig,
    resetConfig,
    openConfigModal,
    closeConfigModal,
    saveConfig,
    generateCSSVariables,
    getComponentClasses,
    generatePromptContext
  }
}