import { EMOJI_KEYWORDS } from 'emoogle-emoji-search-engine';
import { CustomGroup } from '../constants';
import { sortKeywordsInPlace } from '../sort-keywords';
import type { GetEmojiPickerStore } from '../store/store';
import type { SelectedEmoji } from '../types';

export const useSearchAutoComplete = (searchInput: string, getEmojiPickerStore: GetEmojiPickerStore, selectedEmoji?: SelectedEmoji) => {
    if (!searchInput.trim() || !selectedEmoji || selectedEmoji.group !== CustomGroup.SearchResults) {
        return '';
    }

    const emoji = selectedEmoji.emoji;
    const customEmojiKeywords = getEmojiPickerStore().customEmojiKeywords ?? {};
    const keywords = [...((EMOJI_KEYWORDS as Record<string, string[]>)[emoji] || []), ...(customEmojiKeywords[emoji] || [])].filter(
        (keyword) => keyword.startsWith(searchInput)
    );

    if (keywords.length > 0) {
        const recentlySearchedInputs = getEmojiPickerStore().recentlySearchedInputs ?? [];
        sortKeywordsInPlace(keywords, recentlySearchedInputs);
        return keywords[0];
    }

    return '';
};
