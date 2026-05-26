// Ambient declarations for non-TS asset imports used across the app.
// Next.js normally provides these via `next-env.d.ts` -> `next` package types,
// but declaring them here makes the IDE happy even if `node_modules` is in a
// half-installed state or the TS server cache is stale.

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
