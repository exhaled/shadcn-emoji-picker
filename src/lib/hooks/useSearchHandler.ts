import type { GetEmojiPickerStore, SetEmojiPickerStore } from '../store/store';
import type { SelectedEmoji } from '../types';
import { searchEmojis } from 'emoogle-emoji-search-engine';
import { CustomGroup } from '../constants';

export const useSearchHandler = (
	getEmojiPickerStore: GetEmojiPickerStore,
	setEmojiPickerStore: SetEmojiPickerStore
) => {
	return (searchInput: string) => {
		const customEmojiKeywords = getEmojiPickerStore().customEmojiKeywords;
		const customKeywordMostRelevantEmoji =
			getEmojiPickerStore().customKeywordMostRelevantEmoji;
		const recentlySearchedInputs = getEmojiPickerStore().recentlySearchedInputs;
		const searchEmojisResults = searchEmojis(searchInput, undefined, {
			customEmojiKeywords,
			customKeywordMostRelevantEmoji,
			recentlySearchedInputs,
		});
		const frequentlyUsedEmojis = getEmojiPickerStore().frequentlyUsedEmojis;

		let selectedEmoji: SelectedEmoji;

		if (searchEmojisResults.length > 0) {
			selectedEmoji = {
				group: CustomGroup.SearchResults,
				idx: 0,
				emoji: searchEmojisResults[0],
			};
		} else {
			if (searchInput === '' && frequentlyUsedEmojis.length > 0) {
				selectedEmoji = {
					group: CustomGroup.FrequentlyUsed,
					idx: 0,
					emoji: frequentlyUsedEmojis[0],
				};
			} else {
				selectedEmoji = {
					group: 'Smileys & Emotion',
					idx: 0,
					emoji: '😀',
				};
			}
		}

		setEmojiPickerStore({
			searchInput,
			searchEmojisResults,
			selectedEmoji,
		});
	};
}; 