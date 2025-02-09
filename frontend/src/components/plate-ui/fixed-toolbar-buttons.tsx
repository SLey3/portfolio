import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { useEditorReadOnly } from '@udecode/plate-common/react';

import { Icons, iconVariants } from '@/components/icons';

import { InsertDropdownMenu } from './insert-dropdown-menu';
import { MarkToolbarButton } from './mark-toolbar-button';
import { ModeDropdownMenu } from './mode-dropdown-menu';
import { ToolbarGroup } from './toolbar';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';
import { AlignDropdownMenu } from './align-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { CommentToolbarButton } from './comment-toolbar-button';
import { EmojiDropdownMenu } from './emoji-dropdown-menu';
import { IndentListToolbarButton } from './indent-list-toolbar-button';
import { IndentToolbarButton } from './indent-toolbar-button';
import { LineHeightDropdownMenu } from './line-height-dropdown-menu';
import { LinkToolbarButton } from './link-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { MoreDropdownMenu } from './more-dropdown-menu';
import { OutdentToolbarButton } from './outdent-toolbar-button';
import { TableDropdownMenu } from './table-dropdown-menu';
import { FontBackgroundColorPlugin, FontColorPlugin } from '@udecode/plate-font/react';
import { ListStyleType } from '@udecode/plate-indent-list';
import { ImagePlugin } from '@udecode/plate-media/react';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: 'translateX(calc(-1px))',
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDropdownMenu />
              <TurnIntoDropdownMenu />
            </ToolbarGroup>

            <ToolbarGroup>
              <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
                <Icons.bold />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={ItalicPlugin.key}
                tooltip="Italic (⌘+I)"
              >
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
            </ToolbarGroup>
          </>
        )}
        <ToolbarGroup>
          <ColorDropdownMenu
            nodeType={FontColorPlugin.key}
            tooltip="Text Color">
            <Icons.color
              className={iconVariants({
                variant: 'toolbar',
              })}
            />
          </ColorDropdownMenu>
          <ColorDropdownMenu
            nodeType={FontBackgroundColorPlugin.key}
            tooltip="Highlight Color">
            <Icons.bg
              className={iconVariants({
                variant: 'toolbar',
              })}
            />
          </ColorDropdownMenu>
        </ToolbarGroup>

        <ToolbarGroup>
          <AlignDropdownMenu />
          <LineHeightDropdownMenu />
          <IndentListToolbarButton
            nodeType={ListStyleType.Disc}
          />
          <IndentListToolbarButton
            nodeType={ListStyleType.Decimal}
          />
          <OutdentToolbarButton />
          <IndentToolbarButton />
        </ToolbarGroup>

        <ToolbarGroup>
          <LinkToolbarButton />
          <MediaToolbarButton nodeType={ImagePlugin.key} />
          <TableDropdownMenu />
          <EmojiDropdownMenu />
          <CommentToolbarButton />
          <MoreDropdownMenu />
        </ToolbarGroup>

        <div className="grow" />

        <ToolbarGroup noSeparator>
          <ModeDropdownMenu />
        </ToolbarGroup>
      </div>
    </div>
  );
}
