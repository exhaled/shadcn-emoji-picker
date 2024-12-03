import { memo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EmojiPicker } from './EmojiPicker';
import type { EmojiPickerProps } from '../lib/store/store';
import { cx } from '../lib/cx';

interface ToggleableEmojiPickerProps extends EmojiPickerProps {
  buttonClassName?: string;
  buttonContent?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const MemoizedEmojiPicker = memo(EmojiPicker);

export const ToggleableEmojiPicker = ({
  buttonClassName,
  buttonContent = '😊',
  align = 'center',
  side = 'bottom',
  ...emojiPickerProps
}: ToggleableEmojiPickerProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cx(
            'p-2 rounded-lg bg-white transition-colors',
            buttonClassName
          )}
        >
          {buttonContent}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={side}
          align={align}
          sideOffset={5}
          className="z-50 bg-transparent outline-none"
        >
          <MemoizedEmojiPicker {...emojiPickerProps} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}; 