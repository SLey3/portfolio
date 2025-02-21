import { cn, withRef } from '@udecode/cn';

import { PlateElement } from './plate-element';

export const TableRowElement = withRef<
  typeof PlateElement,
  {
    hideBorder?: boolean;
  }
>(({ children, hideBorder, ...props }, ref) => {
  return (
    <PlateElement
      as="tr"
      className={cn('h-full', hideBorder && 'border-none')}
      ref={ref}
      {...props}
    >
      {children}
    </PlateElement>
  );
});
