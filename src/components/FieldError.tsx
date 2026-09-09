import { AlertCircleIcon } from './icons';
import { cn } from '@/lib/utils';

type FieldErrorProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  message?: string;
  /** Keeps a line of height while empty so showing the message does not shift the layout. */
  reserveSpace?: boolean;
  iconSize?: number;
};

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
      aria-live="polite"
      aria-atomic="true"
      {...rest}
      className={cn(
        'flex items-start gap-1 text-xs font-medium text-destructive',
        reserveSpace && 'min-h-4',
        className,
      )}
    >
      {message ? (
        <>
          <AlertCircleIcon size={iconSize} aria-hidden="true" className="mt-px shrink-0" />
          <span>{message}</span>
        </>
      ) : null}
    </span>
  );
}
