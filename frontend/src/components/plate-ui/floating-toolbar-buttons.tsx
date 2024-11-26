import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { useEditorReadOnly } from '@udecode/plate-common/react';

import { Icons, iconVariants } from '@/components/icons';

import { MarkToolbarButton } from './mark-toolbar-button';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { CommentToolbarButton } from './comment-toolbar-button';
import { MoreDropdownMenu } from './more-dropdown-menu';
import { FontBackgroundColorPlugin, FontColorPlugin } from '@udecode/plate-font/react';

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          <TurnIntoDropdownMenu />

          <ColorDropdownMenu
            nodeType={FontColorPlugin.key}
            tooltip="Text Color"
          >
            <Icons.color
              className={iconVariants({ variant: 'toolbar' })}
            />
          </ColorDropdownMenu>
          <ColorDropdownMenu
            nodeType={FontBackgroundColorPlugin.key}
            tooltip="Highlight Color"
          >
            <Icons.bg
              className={iconVariants({ variant: 'toolbar' })}
            />
          </ColorDropdownMenu>
          <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
            <Icons.bold />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={ItalicPlugin.key} tooltip="Italic (⌘+I)">
            <Icons.italic />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={UnderlinePlugin.key}
            tooltip="Underline (⌘+U)"
          >
            <Icons.underline />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={StrikethroughPlugin.key}
            tooltip="Strikethrough (⌘+⇧+M)"
          >
            <Icons.strikethrough />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
            <Icons.code />
          </MarkToolbarButton>
          <CommentToolbarButton />
        </>
      )}
      <MoreDropdownMenu />
    </>
  );
}
