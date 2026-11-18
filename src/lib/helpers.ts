/** Small helpers shared by the practice modules. */
import { clsx, type ClassValue } from '@/lib/clsx';

export { clsx };
export type { ClassValue };

/** Builds a test id with a module prefix, e.g. t('radio', 'male') -> "radio-male". */
export const testId = (module: string, key: string) => `${module}-${key}`;

/** Deterministic pseudo id used for locally created records. */
let localCounter = 1000;
export const nextLocalId = () => {
  localCounter += 1;
  return localCounter;
};
