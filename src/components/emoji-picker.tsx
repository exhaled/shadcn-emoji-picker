import { FC, memo } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EmojiPickerProps } from '../lib/store/store';
import { EmojiPickerEmpty } from '@/components/emoji-picker-core';
import { Button } from './ui/button';

interface EmojiPickerSProps extends EmojiPickerProps {}

const MemoizedEmojiPicker = memo(EmojiPickerEmpty);

const EmojiPicker: FC<EmojiPickerSProps> = (props) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Open</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0 w-[var(--emoji-picker-width)]">
				<MemoizedEmojiPicker {...props} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { EmojiPicker };
