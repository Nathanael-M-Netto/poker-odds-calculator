// Type declarations for importing CSS/SCSS files in TypeScript
// This allows side-effect imports like `import './globals.css'`
// and also supports CSS modules when using `*.module.css` or `*.module.scss`.

declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// CSS Modules (typed as a map of className -> string)
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
