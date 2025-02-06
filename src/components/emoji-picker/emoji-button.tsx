import { Button } from '../ui/button';

interface EmojiButtonProps {
    emoji: string;
    isSelected: boolean;
    onClick: () => void;
}

export const EmojiButton = ({ emoji, isSelected, onClick }: EmojiButtonProps) => {
    return (
        <Button size='icon' variant={isSelected ? 'secondary' : 'ghost'} className='size-8 text-lg' onClick={onClick}>
            {emoji}
        </Button>
    );
};
