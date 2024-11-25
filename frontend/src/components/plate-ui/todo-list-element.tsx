import React from 'react';

import { cn, withRef } from '@udecode/cn';
import {
  useTodoListElement,
  useTodoListElementState,
} from '@udecode/plate-list/react';

import { Checkbox } from './checkbox';
import { PlateElement } from './plate-element';

export const TodoListElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const { element } = props;
    const state = useTodoListElementState({ element });
    const { checkboxProps } = useTodoListElement(state);

    return (
      <PlateElement
        className={cn('flex flex-row py-1', className)}
        ref={ref}
        {...props}
      >
        <div
          className="mr-1.5 flex select-none items-center justify-center"
          contentEditable={false}
        >
          <Checkbox {...checkboxProps} />
        </div>
        <span
          contentEditable={!state.readOnly}
          suppressContentEditableWarning
          className={cn(
            'flex-1 focus:outline-none',
            state.checked && 'text-muted-foreground line-through'
          )}
        >
          {children}
        </span>
      </PlateElement>
    );
  }
);
