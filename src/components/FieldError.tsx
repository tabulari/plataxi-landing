import { AlertCircleIcon } from './icons';
import { cn } from '@/lib/utils';

type FieldErrorProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  message?: string;
  /** Keeps a line of height while empty so showing the message does not shift the layout. */
  reserveSpace?: boolean;
  iconSize?: number;
};

/**
 * The 5-color palette has no red, so error text sits at #111110 — the same value
 * as body copy. The icon is what carries the state, not the color.
 */
export function FieldError({
  message,
  reserveSpace = true,
  iconSize = 13,
  className,
  ...rest
}: FieldErrorProps) {
  return (
    <span
      role="alert"
      {...rest}
      className={cn(
        'flex items-start gap-1 text-xs font-medium text-destructive',
        reserveSpace && 'min-h-4',
        className,
      )}
    >
      {message ? (
        <>
          <AlertCircleIcon size={iconSize} className="mt-px shrink-0" />
          {message}
        </>
      ) : null}
    </span>
  );
}
