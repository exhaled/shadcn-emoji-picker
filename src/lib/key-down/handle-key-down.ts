import { CustomGroup } from '../constants';
import type { GetEmojiPickerStore, SetEmojiPickerStore } from '../store/store';
import { getNextSelectedEmoji } from './get-next-selected-emoji';
import { Key, isArrowKey } from './keys';

/**
 * handleKeyDown handles 5 keydown events (4 arrows, enter).
 *
 * For arrow keys, it computes and updates the next selected emoji.
 * For enter key, it calls handleEmojiSelect.
 */
export const handleKeyDown = (key: Key, getEmojiPickerStore: GetEmojiPickerStore, setEmojiPickerStore: SetEmojiPickerStore) => {
    if (isArrowKey(key)) {
        const selectedEmoji = getEmojiPickerStore().selectedEmoji;

        const searchInput = getEmojiPickerStore().searchInput;
        const searchEmojisResults = getEmojiPickerStore().searchEmojisResults;
        const frequentlyUsedEmojis = getEmojiPickerStore().frequentlyUsedEmojis ?? [];

        const firstGroup = searchInput ? CustomGroup.SearchResults : CustomGroup.FrequentlyUsed;
        const firstGroupEmojis = searchInput ? searchEmojisResults : frequentlyUsedEmojis;

        const nextSelectedEmoji = getNextSelectedEmoji(selectedEmoji, key, firstGroup, firstGroupEmojis);
        setEmojiPickerStore({
            selectedEmoji: nextSelectedEmoji,
        });
    } else if (key === Key.Enter) {
        const selectedEmoji = getEmojiPickerStore().selectedEmoji;
        if (selectedEmoji) {
            const baseEmoji = selectedEmoji.emoji;
            const handleEmojiSelect = getEmojiPickerStore().handleEmojiSelect;
            handleEmojiSelect(baseEmoji, selectedEmoji.group);
        }
    }
};
