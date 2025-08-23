import type { ReactNode } from 'react';

// Define the AI state and UI state types
export type AIState = Array<{
  role: 'user' | 'assistant';
  content: string;
}>;

export type UIState = Array<{
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}>;

export interface Message {
  type: 'user' | 'assistant';
  content: string;
}

export interface ClientChat {
  id: string;
  demo: string;
}

export type LoadingStage = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  progress: number;
};

// Design Configuration Types
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface TypographyConfig {
  fontFamily: 'inter' | 'poppins' | 'roboto' | 'opensans' | 'lato' | 'montserrat';
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ComponentVariants {
  button: 'rounded' | 'square' | 'pill' | 'ghost' | 'outline';
  input: 'default' | 'floating' | 'minimal' | 'material';
  card: 'flat' | 'elevated' | 'glass' | 'bordered';
  modal: 'default' | 'fullscreen' | 'slide' | 'fade';
}

export interface SpacingConfig {
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}

export interface DesignSystemConfig {
  mode: 'light' | 'dark' | 'custom';
  colors: ColorPalette;
  typography: TypographyConfig;
  components: ComponentVariants;
  spacing: SpacingConfig;
  animations: {
    enabled: boolean;
    duration: 'fast' | 'normal' | 'slow';
    easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  };
}

export interface DesignConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: DesignSystemConfig) => void;
  initialConfig?: Partial<DesignSystemConfig>;
}

export type ColorPreset = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'indigo' | 'teal' | 'cyan' | 'emerald';

export interface ColorPresetOption {
  id: ColorPreset;
  name: string;
  colors: Partial<ColorPalette>;
}

export type FontPreset = 'modern' | 'classic' | 'tech' | 'creative' | 'corporate' | 'minimal';

export interface FontPresetOption {
  id: FontPreset;
  name: string;
  typography: Partial<TypographyConfig>;
}
