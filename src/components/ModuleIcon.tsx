import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

/**
 * Resolve a lucide icon by name (as stored in the shared catalog) with a
 * sensible fallback so a typo can never crash the UI.
 */
export function ModuleIcon({ name, ...props }: { name: string } & LucideProps) {
  const registry = Icons as unknown as Record<string, React.ComponentType<LucideProps>>;
  const Component = registry[name] ?? Icons.FlaskConical;
  return <Component aria-hidden {...props} />;
}
