import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { insertEmptyElement } from '@udecode/plate-common';
import {
  ParagraphPlugin,
  focusEditor,
  useEditorRef,
} from '@udecode/plate-common/react';
import { HEADING_KEYS } from '@udecode/plate-heading';

import { Icons } from '@/components/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';
import { insertTable, TablePlugin } from '@udecode/plate-table/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { LinkPlugin, triggerFloatingLink } from '@udecode/plate-link/react';
import { insertMedia } from '@udecode/plate-media';
import { insertEmptyCodeBlock } from '@udecode/plate-code-block';
import { insertColumnGroup } from '@udecode/plate-layout';

const items = [
  {
    items: [
      {
        description: 'Paragraph',
        icon: Icons.paragraph,
        label: 'Paragraph',
        value: ParagraphPlugin.key,
      },
      {
        description: 'Heading 1',
        icon: Icons.h1,
        label: 'Heading 1',
        value: HEADING_KEYS.h1,
      },
      {
        description: 'Heading 2',
        icon: Icons.h2,
        label: 'Heading 2',
        value: HEADING_KEYS.h2,
      },
      {
        description: 'Heading 3',
        icon: Icons.h3,
        label: 'Heading 3',
        value: HEADING_KEYS.h3,
      },
      {
        description: 'Quote (⌘+⇧+.)',
        icon: Icons.blockquote,
        label: 'Quote',
        value: BlockquotePlugin.key,
      },
      {
        value: TablePlugin.key,
        label: 'Table',
        description: 'Table',
        icon: Icons.table,
      },
      {
        value: HorizontalRulePlugin.key,
        label: 'Divider',
        description: 'Divider (---)',
        icon: Icons.minus,
      },
      {
        value: ColumnPlugin.key,
        label: 'Columns',
        description: 'Column Group',
        icon: Icons.doubleColumn,
      }
    ],
    label: 'Basic',
  },
  {
    label: 'Media',
    items: [
      {
        value: CodeBlockPlugin.key,
        label: 'Code',
        description: 'Code (```)',
        icon: Icons.codeblock,
      },
      {
        value: ImagePlugin.key,
        label: 'Image',
        description: 'Image',
        icon: Icons.image,
      },
      {
        value: MediaEmbedPlugin.key,
        label: 'Embed',
        description: 'Embed',
        icon: Icons.embed,
      },
    ],
  },
  {
    label: 'Inline',
    items: [
      {
        value: LinkPlugin.key,
        label: 'Link',
        description: 'Link',
        icon: Icons.link,
      },
    ],
  },
];

export function InsertDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={openState.open} tooltip="Insert">
          <Icons.add />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto"
      >
        {items.map(({ items: nestedItems, label }, index) => (
          <React.Fragment key={label}>
            {index !== 0 && <DropdownMenuSeparator />}

            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {nestedItems.map(
              ({ icon: Icon, label: itemLabel, value: type }) => (
                <DropdownMenuItem
                  className="min-w-[180px]"
                  key={type}
                  onSelect={() => {
                    switch (type) {
                      case CodeBlockPlugin.key: {
                        insertEmptyCodeBlock(editor);
                      
                        break;
                      }
                      case ColumnPlugin.key: {
                        insertColumnGroup(editor);

                        break;
                      }
                      case ImagePlugin.key: {
                        insertMedia(editor, { type: ImagePlugin.key });
                      
                        break;
                      }
                      case MediaEmbedPlugin.key: {
                        insertMedia(editor, {
                          type: MediaEmbedPlugin.key,
                        });
                      
                        break;
                      }
                      case TablePlugin.key: {
                        insertTable(editor);
                      
                        break;
                      }
                      case LinkPlugin.key: {
                        triggerFloatingLink(editor, { focused: true });
                      
                        break;
                      }
                      default: {
                        insertEmptyElement(editor, type, {
                          nextBlock: true,
                          select: true,
                        });
                      }
                    }

                    focusEditor(editor);
                  }}
                >
                  <Icon className="mr-2 size-5" />
                  {itemLabel}
                </DropdownMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
