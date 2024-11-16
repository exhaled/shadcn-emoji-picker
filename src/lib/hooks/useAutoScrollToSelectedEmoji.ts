import { useEffect, useRef } from 'react';
import { useEmojiPickerStore } from '../store/hooks';
import { GROUP_TITLE_HEIGHT } from '../constants';

/**
 * A hook that auto scrolls to the selected emoji if it's out of view.
 */
export const useAutoScrollToSelectedEmoji = (isSelected: boolean) => {
	const emojiButtonRef = useRef<HTMLButtonElement>(null);
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	useEffect(() => {
		if (isSelected) {
			const scrollPane = getEmojiPickerStore().scrollPaneElement!;

			const scrollPaneBoundingClientRect = scrollPane.getBoundingClientRect();
			const scrollPaneTop = scrollPaneBoundingClientRect.top;
			const scrollPaneTopExcludeGroupTitle = scrollPaneTop + GROUP_TITLE_HEIGHT;
			const scrollPaneBottom = scrollPaneBoundingClientRect.bottom;

			const emojiButtonBoundingClientRect =
				emojiButtonRef.current!.getBoundingClientRect();
			const emojiButtonTop = emojiButtonBoundingClientRect.top;
			const emojiButtonBottom = emojiButtonBoundingClientRect.bottom;

			const updateLastAutoScrollTime = () => {
				setEmojiPickerStore({
					lastAutoScrollTimeInMs: Date.now(),
				});
			};

			if (emojiButtonBottom > scrollPaneBottom) {
				updateLastAutoScrollTime();
				scrollPane.scrollBy(0, emojiButtonBottom - scrollPaneBottom);
			} else if (emojiButtonTop < scrollPaneTopExcludeGroupTitle) {
				updateLastAutoScrollTime();
				scrollPane.scrollBy(0, emojiButtonTop - scrollPaneTopExcludeGroupTitle);
			}
		}
	}, [isSelected]);

	return emojiButtonRef;
};
