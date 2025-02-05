import { useEffect } from 'react';
import { useEmojiPickerSelector } from '../store/hooks';
import { NUM_EMOJIS_PER_ROW } from '../constants';

export const useEmojiScroll = (scrollPaneRef: React.RefObject<HTMLDivElement>) => {
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const lastScrollTime = useEmojiPickerSelector((state) => state.lastAutoScrollTimeInMs);

	useEffect(() => {
		if (!selectedEmoji || !scrollPaneRef.current) return;

		const viewport = scrollPaneRef.current.querySelector('[data-radix-scroll-area-viewport]');
		if (!viewport) return;

		// Find the row that contains the selected emoji
		const rowNumber = Math.floor(selectedEmoji.idx / NUM_EMOJIS_PER_ROW) + 1;
		const rowElement = viewport.querySelector(`[data-row-number="${rowNumber}"]`) as HTMLElement;

		if (rowElement) {
			// Get the emoji button height (including gap)
			const emojiHeight = rowElement.offsetHeight;

			// Calculate the scroll position
			const viewportHeight = viewport.clientHeight;
			const rowTop = rowElement.offsetTop;
			const rowBottom = rowTop + emojiHeight;
			const scrollTop = viewport.scrollTop;
			const scrollBottom = scrollTop + viewportHeight;

			// If the row is not fully visible or too close to the bottom
			if (rowTop < scrollTop || rowBottom > scrollBottom - emojiHeight) {
				// Scroll to show the current row plus one row margin at the bottom
				viewport.scrollTo({
					top: Math.max(0, rowTop - viewportHeight + emojiHeight * 2),
					behavior: 'smooth',
				});
			}
		}
	}, [selectedEmoji?.idx, selectedEmoji?.group, lastScrollTime]);
};
