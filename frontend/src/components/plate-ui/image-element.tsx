import React from 'react';

import { cn, withRef } from '@udecode/cn';
import { withHOC } from '@udecode/plate-common/react';
import { Image, ImagePlugin, useMediaState } from '@udecode/plate-media/react';
import { ResizableProvider, useResizableStore } from '@udecode/plate-resizable';

import { Caption, CaptionTextarea } from './caption';
import { MediaPopover } from './media-popover';
import { PlateElement } from './plate-element';
import {
  Resizable,
  ResizeHandle,
  mediaResizeHandleVariants,
} from './resizable';

export const ImageElement = withHOC(
  ResizableProvider,
  withRef<typeof PlateElement>(
    ({ children, className, nodeProps, ...props }, ref) => {
      const { align = 'center', focused, readOnly, selected } = useMediaState();

      const width = useResizableStore().get.width();

      return (
        <MediaPopover plugin={ImagePlugin}>
          <PlateElement
            className={cn('py-2.5', className)}
            ref={ref}
            {...props}
          >
            <figure className="group relative m-0" contentEditable={false}>
              <Resizable
                align={align}
                options={{
                  align,
                  readOnly,
                }}
              >
                <ResizeHandle
                  className={mediaResizeHandleVariants({ direction: 'left' })}
                  options={{ direction: 'left' }}
                />
                <Image
                  alt=""
                  className={cn(
                    'block w-full max-w-full cursor-pointer object-cover px-0',
                    'rounded-sm',
                    focused && selected && 'ring-2 ring-ring ring-offset-2'
                  )}
                  {...nodeProps}
                />
                <ResizeHandle
                  options={{ direction: 'right' }}
                  className={mediaResizeHandleVariants({
                    direction: 'right',
                  })}
                />
              </Resizable>

              <Caption align={align} style={{ width }}>
                <CaptionTextarea
                  placeholder="Write a caption..."
                  readOnly={readOnly}
                />
              </Caption>
            </figure>

            {children}
          </PlateElement>
        </MediaPopover>
      );
    }
  )
);
