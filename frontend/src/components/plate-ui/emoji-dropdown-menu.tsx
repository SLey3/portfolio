import React from 'react';

import {
  type EmojiDropdownMenuOptions,
  useEmojiDropdownMenuState,
} from '@udecode/plate-emoji/react';

import { Icons } from '@/components/icons';

import { emojiCategoryIcons, emojiSearchIcons } from './emoji-icons';
import { EmojiPicker } from './emoji-picker';
import { EmojiToolbarDropdown } from './emoji-toolbar-dropdown';
import { ToolbarButton } from './toolbar';

type EmojiDropdownMenuProps = {
  options?: EmojiDropdownMenuOptions;
} & React.ComponentPropsWithoutRef<typeof ToolbarButton>;

export function EmojiDropdownMenu({
  options,
  ...props
}: EmojiDropdownMenuProps) {
  const { emojiPickerState, isOpen, setIsOpen } =
    useEmojiDropdownMenuState(options);

  return (
    <EmojiToolbarDropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      control={
        <ToolbarButton isDropdown pressed={isOpen} tooltip="Emoji" {...props}>
          <Icons.emoji className="size-4" />
        </ToolbarButton>
      }
    >
      <EmojiPicker
        {...emojiPickerState}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        settings={options?.settings}
        icons={{
          categories: emojiCategoryIcons,
          search: emojiSearchIcons,
        }}
      />
    </EmojiToolbarDropdown>
  );
}
