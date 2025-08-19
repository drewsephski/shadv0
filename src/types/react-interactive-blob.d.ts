declare module 'react-interactive-blob' {
  interface BlobityOptions {
    color?: string;
    dotColor?: string;
    size?: number;
    focusableElements?: string;
    focusableElementsOffsetX?: number;
    focusableElementsOffsetY?: number;
    focusableElementsRadius?: number;
    focusableElementsRadiusScale?: number;
    focusableElementsScale?: number;
    focusableElementsDuration?: number;
    focusableElementsEasing?: string;
    focusableElementsDelay?: number;
    focusableElementsOpacity?: number;
    focusableElementsZIndex?: number;
    focusableElementsBlur?: number;
    focusableElementsShadow?: string;
    focusableElementsShadowColor?: string;
    focusableElementsShadowBlur?: number;
    focusableElementsShadowOffsetX?: number;
    focusableElementsShadowOffsetY?: number;
  }

  interface BlobityInstance {
    updateOptions: (options: Partial<BlobityOptions>) => void;
  }

  export function useInteractiveBlob(options?: BlobityOptions): BlobityInstance;
}
