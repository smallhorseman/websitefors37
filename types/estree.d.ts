// Type declarations for estree and estree-jsx
// This helps resolve TypeScript issues with MDX and AST-related packages

declare module 'estree' {
  export * from '@types/estree';
}

declare module 'estree-jsx' {
  export * from '@types/estree-jsx';
}

// Global type reference
/// <reference types="@types/estree" />
/// <reference types="@types/estree-jsx" />