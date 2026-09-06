'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex" render={<h3 className="flex flex-1 m-0" />}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-[border-color,box-shadow,transform,opacity] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-aria-expanded:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[open]:animate-accordion-down data-[closed]:animate-accordion-up"
      {...props}
    >
      <div className={cn('pt-0 pb-2.5', className)}>
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
