import { useEffect } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { useEmojiPickerSelector } from '../store/hooks';
import { NUM_EMOJIS_PER_ROW } from '../constants';
import type { ScrollRefs } from './useSetScrollPaneRef';

export const useEmojiScroll = ({ scrollPaneRef, viewportRef }: ScrollRefs) => {
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const lastScrollTime = useEmojiPickerSelector((state) => state.lastAutoScrollTimeInMs);

	useEffect(() => {
		if (!selectedEmoji || !scrollPaneRef.current || !viewportRef.current) return;

		// Find the row that contains the selected emoji
		const rowNumber = Math.floor(selectedEmoji.idx / NUM_EMOJIS_PER_ROW) + 1;
		const rowElement = viewportRef.current.querySelector(`[data-row-number="${rowNumber}"]`) as HTMLElement;

		if (rowElement) {
			// Get the emoji button height (including gap)
			const emojiHeight = rowElement.offsetHeight;

			// Calculate the scroll position
			const viewportHeight = viewportRef.current.clientHeight;
			const rowTop = rowElement.offsetTop;
			const rowBottom = rowTop + emojiHeight;
			const scrollTop = viewportRef.current.scrollTop;
			const scrollBottom = scrollTop + viewportHeight;

			// If the row is not fully visible or too close to the bottom
			if (rowTop < scrollTop || rowBottom > scrollBottom - emojiHeight) {
				// Scroll to show the current row plus one row margin at the bottom
				viewportRef.current.scrollTo({
					top: Math.max(0, rowTop - viewportHeight + emojiHeight * 2),
					behavior: 'smooth',
				});
			}
		}
	}, [selectedEmoji?.idx, selectedEmoji?.group, lastScrollTime]);
};
