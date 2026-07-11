declare module 'vite' {
  export function defineConfig<T>(config: T): T;
}

declare module 'react' {
  export const StrictMode: (props: {
    children?: import('react').ReactNode;
  }) => import('react').ReactNode;
  export type ReactNode = unknown;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useState<T>(initialState: T): [T, (value: T) => void];
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: unknown): void;
  }

  export function createRoot(container: HTMLElement): Root;
}

declare module 'lucide-react' {
  export interface IconProps {
    'aria-hidden'?: string | boolean;
    className?: string;
    size?: number | string;
  }

  export type LucideIcon = (props: IconProps) => unknown;

  export const Clipboard: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const MessageSquareText: LucideIcon;
  export const PenLine: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Settings: LucideIcon;
  export const Sparkles: LucideIcon;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: Record<string, unknown>;
  }
}

declare module '*.css';

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: Record<string, unknown>;
    }
  }

  export function jsx(type: unknown, props: unknown, key?: unknown): unknown;
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown;
  export const Fragment: unknown;
}

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    models: {
      generateContent(options: { model: string; contents: string }): Promise<{ text?: string }>;
    };
  }
}
