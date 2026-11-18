import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type CustomElProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'qa-shadow-card': CustomElProps;
      'qa-nested-shadow': CustomElProps;
      'qa-nested-inner': CustomElProps;
    }
  }
}

export {};
