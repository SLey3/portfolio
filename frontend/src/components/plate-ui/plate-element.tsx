import React from 'react';

import type { PlateElementProps } from '@udecode/plate-common/react';

import { cn } from '@udecode/cn';
import { PlateElement as PlateElementPrimitive } from '@udecode/plate-common/react';
import { useBlockSelectableStore } from '@udecode/plate-selection/react';

import { BlockSelection } from './block-selection';

export const PlateElement = React.forwardRef<HTMLDivElement, PlateElementProps>(
  ({ children, className, ...props }: PlateElementProps, ref) => {
    const selectable = useBlockSelectableStore().get.selectable();

    return (
      <PlateElementPrimitive
        className={cn('relative', className)}
        ref={ref}
        {...props}
      >
        {children}

        {selectable ? <BlockSelection /> : null}
      </PlateElementPrimitive>
    );
  }
);
