import { EmojiPickerEmpty } from '@/components/emoji-picker/emoji-picker-core';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Smile } from 'lucide-react';
import { FC, memo } from 'react';
import type { EmojiPickerProps } from '../../lib/store/store';
import { Button } from '../ui/button';

interface EmojiPickerSProps extends EmojiPickerProps {}

const MemoizedEmojiPicker = memo(EmojiPickerEmpty);

const EmojiPicker: FC<EmojiPickerSProps> = (props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={'icon'}>
                    <Smile />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[var(--emoji-picker-width)] p-0'>
                <MemoizedEmojiPicker {...props} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { EmojiPicker };
