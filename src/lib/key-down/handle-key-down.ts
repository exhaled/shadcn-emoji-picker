import type { GetEmojiPickerStore, SetEmojiPickerStore } from '../store/store';
import { CustomGroup } from '../constants';
import { Key, isArrowKey } from './keys';
import { getNextSelectedEmoji } from './get-next-selected-emoji';
import { getEmojiWithVariant } from '../emoji-variants';

/**
 * handleKeyDown handles 5 keydown events (4 arrows, enter).
 *
 * For arrow keys, it computes and updates the next selected emoji.
 * For enter key, it calls the onEmojiClick callback.
 */
export const handleKeyDown = (
	key: Key,
	getEmojiPickerStore: GetEmojiPickerStore,
	setEmojiPickerStore: SetEmojiPickerStore
) => {
	if (isArrowKey(key)) {
		const selectedEmoji = getEmojiPickerStore().selectedEmoji;

		const searchInput = getEmojiPickerStore().searchInput;
		const searchEmojisResults = getEmojiPickerStore().searchEmojisResults;
		const frequentlyUsedEmojis =
			getEmojiPickerStore().frequentlyUsedEmojis ?? [];

		const firstGroup = searchInput
			? CustomGroup.SearchResults
			: CustomGroup.FrequentlyUsed;
		const firstGroupEmojis = searchInput
			? searchEmojisResults
			: frequentlyUsedEmojis;

		const nextSelectedEmoji = getNextSelectedEmoji(
			selectedEmoji,
			key,
			firstGroup,
			firstGroupEmojis
		);
		setEmojiPickerStore({
			selectedEmoji: nextSelectedEmoji,
		});
	} else if (key === Key.Enter) {
		const selectedEmoji = getEmojiPickerStore().selectedEmoji;
		if (selectedEmoji) {
			const handleEnterKeyDown = getEmojiPickerStore().onEmojiClick;
			if (handleEnterKeyDown) {
				const baseEmoji = selectedEmoji.emoji;
				const skinTone = getEmojiPickerStore().skinTone;
				const emojiToSpecialVariant =
					getEmojiPickerStore().emojiToSpecialVariant;
				const emojiWithVariant = getEmojiWithVariant(
					baseEmoji,
					skinTone,
					emojiToSpecialVariant
				);
				const resetEmojiPickerState =
					getEmojiPickerStore().resetEmojiPickerState;
				const searchInput = getEmojiPickerStore().searchInput;
				handleEnterKeyDown(
					emojiWithVariant,
					resetEmojiPickerState,
					baseEmoji,
					selectedEmoji.group,
					searchInput
				);
			}
		}
	}
};
