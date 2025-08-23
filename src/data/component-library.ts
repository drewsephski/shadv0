// Component Library Data Structure
// Comprehensive component library with Shadcn UI integration

import {
  ComponentDefinition,
  ComponentCategory,
  ComponentMetadata,
  ComponentProp,
  ComponentVariant,
  ComponentSlot,
  ComponentEvent,
  ComponentStyles,
  ComponentCode,
  ComponentDocumentation,
  CodeExample,
  AccessibilityInfo,
  BrowserSupport
} from '@/types/component-library';

// Utility function to create component metadata
const createComponentMetadata = (
  id: string,
  name: string,
  description: string,
  category: ComponentCategory,
  tags: string[] = []
): ComponentMetadata => ({
  id,
  name,
  description,
  category,
  tags,
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Utility function to create component props
const createProp = (
  name: string,
  type: ComponentProp['type'],
  required: boolean = false,
  defaultValue?: any,
  description?: string,
  options?: string[]
): ComponentProp => ({
  name,
  type,
  required,
  defaultValue,
  description,
  options
});

// Utility function to create component variants
const createVariant = (
  id: string,
  name: string,
  props: Record<string, any> = {},
  description?: string
): ComponentVariant => ({
  id,
  name,
  description,
  props
});

// Button Component Definition
export const buttonComponent: ComponentDefinition = {
  metadata: createComponentMetadata(
    'button',
    'Button',
    'A versatile button component with multiple variants and states',
    'forms',
    ['button', 'cta', 'interactive', 'form']
  ),
  props: [
    createProp('children', 'string', true, undefined, 'Button content'),
    createProp('variant', 'enum', false, 'default', 'Button style variant', ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']),
    createProp('size', 'enum', false, 'default', 'Button size', ['default', 'sm', 'lg', 'icon']),
    createProp('disabled', 'boolean', false, false, 'Disable button interaction'),
    createProp('loading', 'boolean', false, false, 'Show loading state'),
    createProp('onClick', 'function', false, undefined, 'Click handler function'),
    createProp('type', 'enum', false, 'button', 'Button type', ['button', 'submit', 'reset'])
  ],
  variants: [
    createVariant('default', 'Default', { variant: 'default' }),
    createVariant('destructive', 'Destructive', { variant: 'destructive' }, 'For dangerous or destructive actions'),
    createVariant('outline', 'Outline', { variant: 'outline' }, 'Outlined button style'),
    createVariant('secondary', 'Secondary', { variant: 'secondary' }, 'Secondary button style'),
    createVariant('ghost', 'Ghost', { variant: 'ghost' }, 'Ghost button with minimal styling'),
    createVariant('link', 'Link', { variant: 'link' }, 'Button styled as a link')
  ],
  slots: [
    {
      name: 'children',
      description: 'Button content',
      required: true
    }
  ],
  events: [
    {
      name: 'onClick',
      description: 'Triggered when button is clicked',
      payload: { event: 'object' }
    }
  ],
  styles: {
    base: `
      .component-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        user-select: none;
      }

      .component-button:focus-visible {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      .component-button:disabled {
        pointer-events: none;
        opacity: 0.5;
      }
    `,
    variants: {
      default: `
        .component-button--default {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .component-button--default:hover {
          background-color: hsl(var(--primary) / 0.9);
        }
      `,
      destructive: `
        .component-button--destructive {
          background-color: hsl(var(--destructive));
          color: hsl(var(--destructive-foreground));
        }
        .component-button--destructive:hover {
          background-color: hsl(var(--destructive) / 0.9);
        }
      `,
      outline: `
        .component-button--outline {
          border: 1px solid hsl(var(--border));
          background-color: transparent;
          color: hsl(var(--foreground));
        }
        .component-button--outline:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
      `,
      secondary: `
        .component-button--secondary {
          background-color: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
        }
        .component-button--secondary:hover {
          background-color: hsl(var(--secondary) / 0.8);
        }
      `,
      ghost: `
        .component-button--ghost {
          background-color: transparent;
          color: hsl(var(--foreground));
        }
        .component-button--ghost:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
      `,
      link: `
        .component-button--link {
          background-color: transparent;
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        .component-button--link:hover {
          color: hsl(var(--primary) / 0.8);
        }
      `
    },
    responsive: {
      sm: `
        .component-button--sm {
          height: 2rem;
          padding: 0 0.75rem;
          font-size: 0.75rem;
        }
      `,
      md: `
        .component-button--default {
          height: 2.5rem;
          padding: 0 1rem;
        }
      `,
      lg: `
        .component-button--lg {
          height: 3rem;
          padding: 0 1.5rem;
          font-size: 1rem;
        }
      `
    }
  },
  code: {
    html: `
      <button class="component-button {{variant}} {{size}}" {{attributes}}>
        {{children}}
      </button>
    `,
    tsx: `
      import * as React from "react"
      import { cn } from "@/lib/utils"

      export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
        size?: 'default' | 'sm' | 'lg' | 'icon'
        loading?: boolean
      }

      const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
        ({ className, variant = 'default', size = 'default', loading, ...props }, ref) => {
          return (
            <button
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                {
                  "bg-primary text-primary-foreground hover:bg-primary/90": variant === 'default',
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === 'destructive',
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === 'outline',
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === 'secondary',
                  "hover:bg-accent hover:text-accent-foreground": variant === 'ghost',
                  "text-primary underline-offset-4 hover:underline": variant === 'link',
                },
                {
                  "h-10 px-4 py-2": size === 'default',
                  "h-9 rounded-md px-3": size === 'sm',
                  "h-11 rounded-md px-8": size === 'lg',
                  "h-10 w-10": size === 'icon',
                },
                className
              )}
              ref={ref}
              disabled={loading}
              {...props}
            />
          )
        }
      )
      Button.displayName = "Button"

      export { Button }
    `
  },
  documentation: {
    description: 'A versatile button component with multiple variants and states',
    usage: `
      Import the Button component and use it with different variants:

      \`\`\`tsx
      import { Button } from "@/components/ui/button"

      <Button>Default Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button size="sm">Small</Button>
      \`\`\`
    `,
    examples: [
      {
        title: 'Basic Usage',
        code: `<Button>Click me</Button>`,
        language: 'tsx'
      },
      {
        title: 'With Variants',
        code: `
          <div className="flex gap-2">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        `,
        language: 'tsx'
      }
    ],
    accessibility: {
      ariaSupport: true,
      keyboardNavigation: true,
      screenReaderSupport: true,
      focusManagement: true,
      colorContrast: true,
      motionSensitivity: false,
      highContrastSupport: true
    },
    browserSupport: {
      chrome: '88+',
      firefox: '85+',
      safari: '14+',
      edge: '88+'
    }
  }
};

// Input Component Definition
export const inputComponent: ComponentDefinition = {
  metadata: createComponentMetadata(
    'input',
    'Input',
    'A flexible input component with validation and various states',
    'forms',
    ['input', 'form', 'text', 'validation']
  ),
  props: [
    createProp('type', 'enum', false, 'text', 'Input type', ['text', 'email', 'password', 'number', 'tel', 'url', 'search']),
    createProp('placeholder', 'string', false, '', 'Placeholder text'),
    createProp('value', 'string', false, '', 'Input value'),
    createProp('disabled', 'boolean', false, false, 'Disable input'),
    createProp('required', 'boolean', false, false, 'Mark as required'),
    createProp('error', 'string', false, '', 'Error message'),
    createProp('label', 'string', false, '', 'Input label'),
    createProp('helperText', 'string', false, '', 'Helper text'),
    createProp('onChange', 'function', false, undefined, 'Change handler function')
  ],
  variants: [
    createVariant('default', 'Default', { type: 'text' }),
    createVariant('email', 'Email', { type: 'email' }),
    createVariant('password', 'Password', { type: 'password' }),
    createVariant('search', 'Search', { type: 'search' }),
    createVariant('withLabel', 'With Label', { label: 'Label' }),
    createVariant('withError', 'With Error', { error: 'This field is required' })
  ],
  styles: {
    base: `
      .component-input {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .component-input__label {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: hsl(var(--foreground));
      }

      .component-input__wrapper {
        position: relative;
      }

      .component-input__field {
        width: 100%;
        height: 2.5rem;
        padding: 0 0.75rem;
        border: 1px solid hsl(var(--border));
        border-radius: 0.375rem;
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        font-size: 0.875rem;
        transition: all 0.2s ease-in-out;
      }

      .component-input__field:focus {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
        border-color: hsl(var(--ring));
      }

      .component-input__field:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .component-input__error {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: hsl(var(--destructive));
      }

      .component-input__helper {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: hsl(var(--muted-foreground));
      }
    `
  },
  code: {
    html: `
      <div class="component-input">
        {{#if label}}
          <label class="component-input__label" for="{{id}}">{{label}}</label>
        {{/if}}
        <div class="component-input__wrapper">
          <input
            type="{{type}}"
            id="{{id}}"
            class="component-input__field"
            placeholder="{{placeholder}}"
            value="{{value}}"
            {{#if disabled}}disabled{{/if}}
            {{#if required}}required{{/if}}
            {{attributes}}
          />
        </div>
        {{#if error}}
          <p class="component-input__error">{{error}}</p>
        {{/if}}
        {{#if helperText}}
          <p class="component-input__helper">{{helperText}}</p>
        {{/if}}
      </div>
    `,
    tsx: `
      import * as React from "react"
      import { cn } from "@/lib/utils"

      export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label?: string
        error?: string
        helperText?: string
      }

      const Input = React.forwardRef<HTMLInputElement, InputProps>(
        ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
          const inputId = id || React.useId()

          return (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              {label && (
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              )}
              <input
                type={type}
                id={inputId}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-destructive focus-visible:ring-destructive",
                  className
                )}
                ref={ref}
                {...props}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {helperText && (
                <p className="text-sm text-muted-foreground">{helperText}</p>
              )}
            </div>
          )
        }
      )
      Input.displayName = "Input"

      export { Input }
    `
  }
};

// Card Component Definition
export const cardComponent: ComponentDefinition = {
  metadata: createComponentMetadata(
    'card',
    'Card',
    'A flexible card component for displaying content and actions',
    'data-display',
    ['card', 'content', 'layout', 'container']
  ),
  props: [
    createProp('title', 'string', false, '', 'Card title'),
    createProp('description', 'string', false, '', 'Card description'),
    createProp('image', 'image', false, '', 'Card image URL'),
    createProp('actions', 'array', false, [], 'Card actions'),
    createProp('variant', 'enum', false, 'default', 'Card style variant', ['default', 'elevated', 'outlined', 'glass'])
  ],
  variants: [
    createVariant('default', 'Default', { variant: 'default' }),
    createVariant('elevated', 'Elevated', { variant: 'elevated' }),
    createVariant('outlined', 'Outlined', { variant: 'outlined' }),
    createVariant('withImage', 'With Image', { image: 'https://via.placeholder.com/400x200' }),
    createVariant('withActions', 'With Actions', { actions: [{ text: 'Action 1' }, { text: 'Action 2' }] })
  ],
  slots: [
    {
      name: 'header',
      description: 'Card header content'
    },
    {
      name: 'content',
      description: 'Main card content'
    },
    {
      name: 'footer',
      description: 'Card footer content'
    }
  ],
  styles: {
    base: `
      .component-card {
        border-radius: 0.5rem;
        background-color: hsl(var(--card));
        border: 1px solid hsl(var(--border));
        overflow: hidden;
        transition: all 0.2s ease-in-out;
      }

      .component-card__header {
        padding: 1.5rem;
        border-bottom: 1px solid hsl(var(--border));
      }

      .component-card__title {
        font-size: 1.25rem;
        font-weight: 600;
        color: hsl(var(--card-foreground));
        margin-bottom: 0.5rem;
      }

      .component-card__description {
        color: hsl(var(--muted-foreground));
        font-size: 0.875rem;
      }

      .component-card__content {
        padding: 1.5rem;
      }

      .component-card__image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .component-card__footer {
        padding: 1.5rem;
        border-top: 1px solid hsl(var(--border));
        background-color: hsl(var(--muted) / 0.5);
      }
    `,
    variants: {
      elevated: `
        .component-card--elevated {
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .component-card--elevated:hover {
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
      `,
      outlined: `
        .component-card--outlined {
          background-color: transparent;
          border: 2px solid hsl(var(--border));
        }
      `,
      glass: `
        .component-card--glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `
    }
  },
  code: {
    html: `
      <div class="component-card {{variant}}">
        {{#if image}}
          <img src="{{image}}" alt="Card image" class="component-card__image">
        {{/if}}
        <div class="component-card__header">
          {{#if title}}
            <h3 class="component-card__title">{{title}}</h3>
          {{/if}}
          {{#if description}}
            <p class="component-card__description">{{description}}</p>
          {{/if}}
        </div>
        <div class="component-card__content">
          {{content}}
        </div>
        {{#if actions}}
          <div class="component-card__footer">
            {{#each actions}}
              <button class="component-button component-button--secondary">{{text}}</button>
            {{/each}}
          </div>
        {{/if}}
      </div>
    `,
    tsx: `
      import * as React from "react"
      import { cn } from "@/lib/utils"

      export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
        variant?: 'default' | 'elevated' | 'outlined' | 'glass'
      }

      const Card = React.forwardRef<HTMLDivElement, CardProps>(
        ({ className, variant = 'default', ...props }, ref) => (
          <div
            ref={ref}
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm",
              {
                "shadow-lg hover:shadow-xl transition-shadow": variant === 'elevated',
                "border-2 bg-transparent": variant === 'outlined',
                "bg-white/10 backdrop-blur-sm border-white/20": variant === 'glass',
              },
              className
            )}
            {...props}
          />
        )
      )
      Card.displayName = "Card"

      const CardHeader = React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement>
      >(({ className, ...props }, ref) => (
        <div
          ref={ref}
          className={cn("flex flex-col space-y-1.5 p-6", className)}
          {...props}
        />
      ))
      CardHeader.displayName = "CardHeader"

      const CardTitle = React.forwardRef<
        HTMLParagraphElement,
        React.HTMLAttributes<HTMLHeadingElement>
      >(({ className, ...props }, ref) => (
        <h3
          ref={ref}
          className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
          )}
          {...props}
        />
      ))
      CardTitle.displayName = "CardTitle"

      const CardDescription = React.forwardRef<
        HTMLParagraphElement,
        React.HTMLAttributes<HTMLParagraphElement>
      >(({ className, ...props }, ref) => (
        <p
          ref={ref}
          className={cn("text-sm text-muted-foreground", className)}
          {...props}
        />
      ))
      CardDescription.displayName = "CardDescription"

      const CardContent = React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement>
      >(({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
      ))
      CardContent.displayName = "CardContent"

      const CardFooter = React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement>
      >(({ className, ...props }, ref) => (
        <div
          ref={ref}
          className={cn("flex items-center p-6 pt-0", className)}
          {...props}
        />
      ))
      CardFooter.displayName = "CardFooter"

      export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
    `
  }
};

// Main component library
export const componentLibrary: ComponentDefinition[] = [
  buttonComponent,
  inputComponent,
  cardComponent
];

// Component categories mapping
export const componentCategories: Record<ComponentCategory, ComponentDefinition[]> = {
  'layout': [],
  'navigation': [],
  'forms': [buttonComponent, inputComponent],
  'data-display': [cardComponent],
  'feedback': [],
  'overlay': [],
  'media': [],
  'typography': [],
  'icons': [],
  'charts': [],
  'ecommerce': [],
  'social': [],
  'utilities': []
};

// Helper functions
export const getComponentById = (id: string): ComponentDefinition | undefined => {
  return componentLibrary.find(component => component.metadata.id === id);
};

export const getComponentsByCategory = (category: ComponentCategory): ComponentDefinition[] => {
  return componentCategories[category] || [];
};

export const searchComponents = (query: string): ComponentDefinition[] => {
  const lowerQuery = query.toLowerCase();
  return componentLibrary.filter(component =>
    component.metadata.name.toLowerCase().includes(lowerQuery) ||
    component.metadata.description.toLowerCase().includes(lowerQuery) ||
    component.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getComponentCategories = (): ComponentCategory[] => {
  return Object.keys(componentCategories) as ComponentCategory[];
};

export const getComponentsWithDependencies = (componentId: string): string[] => {
  const component = getComponentById(componentId);
  if (!component) return [];

  return component.metadata.dependencies || [];
};

// Export component to different formats
export const exportComponent = (componentId: string, format: 'html' | 'tsx' | 'json'): string => {
  const component = getComponentById(componentId);
  if (!component) throw new Error(`Component ${componentId} not found`);

  switch (format) {
    case 'html':
      return component.code.html;
    case 'tsx':
      return component.code.tsx || '';
    case 'json':
      return JSON.stringify(component, null, 2);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};