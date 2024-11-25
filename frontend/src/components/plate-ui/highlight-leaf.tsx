import React from 'react';

import { cn, withRef } from '@udecode/cn';
import { PlateLeaf } from '@udecode/plate-common/react';

export const HighlightLeaf = withRef<typeof PlateLeaf>(
  ({ children, className, ...props }, ref) => (
    <PlateLeaf
      asChild
      className={cn('bg-highlight/30 text-inherit', className)}
      ref={ref}
      {...props}
    >
      <mark>{children}</mark>
    </PlateLeaf>
  )
);
