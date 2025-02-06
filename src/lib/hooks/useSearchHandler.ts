import { searchEmojis } from 'emoogle-emoji-search-engine';
import { CustomGroup, GROUPS } from '../constants';
import type { GetEmojiPickerStore, SetEmojiPickerStore } from '../store/store';
import type { SelectedEmoji } from '../types';

export const useSearchHandler = (getEmojiPickerStore: GetEmojiPickerStore, setEmojiPickerStore: SetEmojiPickerStore) => {
    return (searchInput: string) => {
        const customEmojiKeywords = getEmojiPickerStore().customEmojiKeywords;
        const customKeywordMostRelevantEmoji = getEmojiPickerStore().customKeywordMostRelevantEmoji;
        const recentlySearchedInputs = getEmojiPickerStore().recentlySearchedInputs;
        const searchEmojisResults = searchEmojis(searchInput, undefined, {
            customEmojiKeywords,
            customKeywordMostRelevantEmoji,
            recentlySearchedInputs,
        });
        let selectedEmoji: SelectedEmoji | undefined;

        if (searchEmojisResults.length > 0) {
            selectedEmoji = {
                group: CustomGroup.SearchResults,
                idx: 0,
                emoji: searchEmojisResults[0],
            };
        } else if (searchInput !== '') {
            selectedEmoji = {
                group: GROUPS[0],
                idx: 0,
                emoji: '😀',
            };
        }

        setEmojiPickerStore({
            searchInput,
            searchEmojisResults,
            selectedEmoji,
        });
    };
};
