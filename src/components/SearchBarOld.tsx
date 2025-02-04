import { useState, useEffect, useRef } from 'react';

import type {
	GetEmojiPickerStore,
	SetEmojiPickerStore,
} from '../lib/store/store';
import type { SelectedEmoji } from '../lib/types';
import { cx } from '../lib/cx';
import {
	useEmojiPickerSelector,
	useEmojiPickerStore,
} from '../lib/store/hooks';
import { CustomGroup } from '../lib/constants';
import { EMOJI_KEYWORDS, searchEmojis } from 'emoogle-emoji-search-engine';
import { sortKeywordsInPlace } from '../lib/sort-keywords';
import { useSearchBarKeyboardFocus } from '../lib/hooks/useSearchBarKeyboardFocus';

const INPUT_SHARED_CLASS_NAMES = 'px-2 py-1 tracking-tight';

/**
 * SearchBar renders the search input field and updates search emoji results
 * and auto complete suggestions based on user input.
 */
export const SearchBarOld = () => {
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	const simulateSearchInputFocus = useEmojiPickerSelector(
		(state) => state.simulateSearchInputFocus
	);
	const [disableSimulateSearchInputFocus, setDisableSimulateSearchInputFocus] =
		useState(false);

	const searchAutoCompleteSuggestion = getSearchAutoCompleteSuggestion(
		searchInput,
		getEmojiPickerStore,
		selectedEmoji
	);

	const inputRef = useRef<HTMLInputElement>(null);
	const autoFocus = useEmojiPickerSelector((state) => state.autoFocus);

	useSearchBarKeyboardFocus(inputRef);

	// In StrictMode, useEffect is called twice and causes the key down event listener
	// set up in useEmojiPickerKeyDownProps to be removed. So we have to set focus
	// with an useEffect by first blurring then focusing, instead of passing autoFocus
	// to input element.
	useEffect(() => {
		if (autoFocus) {
			inputRef.current?.blur();
			inputRef.current?.focus();
		}
	}, [autoFocus]);

	return (
		<div className="px-[var(--emoji-picker-padding)] relative mt-2.5 h-[34px]">
			{/* Show a blinking cursor for demo purpose */}
			{simulateSearchInputFocus && !disableSimulateSearchInputFocus && (
				<div
					className={cx(
						INPUT_SHARED_CLASS_NAMES,
						'absolute border border-transparent user-select-none text-gray-700-ld'
					)}
				>
					<span className="text-transparent">{searchInput}</span>
					<span
						className="-ml-[1px] z-30"
						style={{
							animation: '1s blink step-end infinite',
						}}
					>
						|
					</span>
				</div>
			)}
			<div className="relative">
				<span
					className={cx(
						INPUT_SHARED_CLASS_NAMES,
						'w-full absolute border border-transparent text-gray-400'
					)}
				>
					{searchAutoCompleteSuggestion}
				</span>
				<input
					ref={inputRef}
					className={cx(
						INPUT_SHARED_CLASS_NAMES,
						'w-full absolute border-ld rounded-md outline-none text-gray-700-ld focus:ring ring-sky-300-ld z-20 bg-transparent',
						simulateSearchInputFocus && 'ring'
					)}
					placeholder="🔍Search emoji"
					value={searchInput}
					onChange={(e) => {
						const newSearchInput = e.target.value;
						handleSearch(
							newSearchInput,
							getEmojiPickerStore,
							setEmojiPickerStore
						);
					}}
					onKeyDown={(e) => {
						const key = e.key;
						const caretPosition = (e.target as HTMLInputElement).selectionStart;
						const preventInputCaretMovement = () => e.preventDefault();
						const preventScrollPaneSelectionMovement = () =>
							e.stopPropagation();

						const selectedEmoji = getEmojiPickerStore().selectedEmoji;
						const isFirstGroup =
							selectedEmoji?.group === CustomGroup.FrequentlyUsed ||
							selectedEmoji?.group === CustomGroup.SearchResults;
						const isFirstIdx = selectedEmoji?.idx === 0;
						const isFirstEmoji = isFirstGroup && isFirstIdx;

						if (key === 'ArrowUp' || key === 'ArrowDown') {
							// Prevent up/down arrow from moving the caret to the start/end of the input
							preventInputCaretMovement();
						} else if (key === 'ArrowLeft') {
							// Don't move caret to left if selected emoji exists and not the first emoji,
							// in which case, pressing left arrow should move the emoji selection in the
							// scroll pane
							if (selectedEmoji && !isFirstEmoji) {
								preventInputCaretMovement();
							}
						} else if (key === 'ArrowRight') {
							// Don't move emoji selection in the scroll pane if caret position is not at
							// the end, in which case, pressing right arrow should move the caret to right
							if (caretPosition !== searchInput.length) {
								preventScrollPaneSelectionMovement();
							}
						} else if (key === 'Tab' && searchAutoCompleteSuggestion) {
							// Pressing tab auto completes the search input if there is a suggestion
							e.preventDefault();
							const newSearchInput = searchAutoCompleteSuggestion;
							handleSearch(
								newSearchInput,
								getEmojiPickerStore,
								setEmojiPickerStore
							);
						}
					}}
					onFocus={() => {
						if (simulateSearchInputFocus) {
							setDisableSimulateSearchInputFocus(true);
						}
					}}
					onBlur={() => {
						if (simulateSearchInputFocus) {
							setDisableSimulateSearchInputFocus(false);
						}
					}}
				/>
			</div>
		</div>
	);
};

/**
 * Get search auto complete based on search input and selected search emoji.
 */
const getSearchAutoCompleteSuggestion = (
	searchInput: string,
	getEmojiPickerStore: GetEmojiPickerStore,
	selectedEmoji?: SelectedEmoji
) => {
	if (
		!searchInput.trim() ||
		!selectedEmoji ||
		selectedEmoji.group !== CustomGroup.SearchResults
	) {
		return '';
	}

	const emoji = selectedEmoji.emoji;
	const customEmojiKeywords = getEmojiPickerStore().customEmojiKeywords ?? {};
	const keywords = [
		...((EMOJI_KEYWORDS[emoji] || []) as string[]),
		...(customEmojiKeywords[emoji] || []),
	].filter((keyword) => keyword.startsWith(searchInput));

	if (keywords.length > 0) {
		const recentlySearchedInputs =
			getEmojiPickerStore().recentlySearchedInputs ?? [];
		sortKeywordsInPlace(keywords, recentlySearchedInputs);
		return keywords[0];
	}

	return '';
};

/**
 * Update search emojis results based on search input
 */
const handleSearch = (
	searchInput: string,
	getEmojiPickerStore: GetEmojiPickerStore,
	setEmojiPickerStore: SetEmojiPickerStore
) => {
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
		// Handle case where user clears search input to empty and there are frequently used emojis
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
