import { cx } from '../../lib/cx';
import { useAutoScrollToSelectedEmoji } from '../../lib/hooks/useAutoScrollToSelectedEmoji';

interface EmojiButton {
	emoji: string;
	isSelected: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
}

export const EmojiButton = ({
	emoji,
	isSelected,
	onClick,
	onMouseEnter,
}: EmojiButton) => {
	const emojiButtonRef = useAutoScrollToSelectedEmoji(isSelected);

	return (
		<button
			ref={emojiButtonRef}
			className={cx(
				'flex justify-center items-center outline-none rounded user-select-none w-8 h-8 text-2xl text-gray-700-ld !transition-none',
				isSelected && 'bg-gray-200-ld'
			)}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
		>
			{emoji}
		</button>
	);
};
