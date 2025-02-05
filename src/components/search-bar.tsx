import { useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEmojiPickerSelector, useEmojiPickerStore } from '../lib/store/hooks';
import { useSearchBarKeyboardFocus } from '../lib/hooks/useSearchBarKeyboardFocus';
import { useSearchAutoComplete } from '../lib/hooks/useSearchAutoComplete';
import { useSearchHandler } from '../lib/hooks/useSearchHandler';
import { CustomGroup, WEB_KEY_TO_KEY_DOWN_CONTROL_KEY, type WebKey } from '../lib/constants';
import { handleKeyDown } from '../lib/key-down/handle-key-down';

const inputBaseClasses = 'h-9 px-8 py-1';

const useSearchBarKeyDown = (
	inputRef: React.RefObject<HTMLInputElement>,
	searchAutoCompleteSuggestion: string | undefined,
	handleSearch: (value: string) => void
) => {
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	return (e: React.KeyboardEvent<HTMLInputElement>) => {
		const key = e.key;
		const caretPosition = (e.target as HTMLInputElement).selectionStart;
		const store = getEmojiPickerStore();
		const { selectedEmoji, searchEmojisResults, searchInput } = store;
		const hasSearchResults = searchEmojisResults.length > 0;

		e.stopPropagation();

		if (key === 'Tab') {
			e.preventDefault();
			if (searchAutoCompleteSuggestion && hasSearchResults) {
				handleSearch(searchAutoCompleteSuggestion);
			} else {
				const firstGroupButton = document.querySelector(
					'[role="tablist"] button'
				) as HTMLButtonElement;
				if (firstGroupButton) {
					inputRef.current?.blur();
					firstGroupButton.focus();
				}
			}
			return;
		}

		const isWebArrowKey = (k: string): k is WebKey =>
			k in WEB_KEY_TO_KEY_DOWN_CONTROL_KEY && k !== 'Enter';

		if (isWebArrowKey(key)) {
			const isAtStart = caretPosition === 0;
			const isAtEnd = caretPosition === searchInput.length;
			const isVerticalNavigation = key === 'ArrowUp' || key === 'ArrowDown';

			if (hasSearchResults && (isVerticalNavigation || isAtStart || isAtEnd)) {
				e.preventDefault();
				if (!selectedEmoji) {
					setEmojiPickerStore({
						selectedEmoji: {
							group: CustomGroup.SearchResults,
							idx: 0,
							emoji: searchEmojisResults[0],
						},
					});
					return;
				}

				handleKeyDown(
					WEB_KEY_TO_KEY_DOWN_CONTROL_KEY[key],
					getEmojiPickerStore,
					setEmojiPickerStore
				);
				return;
			}

			if (isVerticalNavigation) {
				e.preventDefault();
			}
		}

		if (key === 'Enter' && selectedEmoji) {
			e.preventDefault();
			const baseEmoji = selectedEmoji.emoji;
			const handleEmojiSelect = store.handleEmojiSelect;
			if (handleEmojiSelect) {
				handleEmojiSelect(baseEmoji, baseEmoji, selectedEmoji.group);
			}
		}
	};
};

/**
 * SearchBar renders the search input field with auto-complete suggestions
 */
export const SearchBar = () => {
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();
	const autoFocus = useEmojiPickerSelector((state) => state.autoFocus);

	const inputRef = useRef<HTMLInputElement>(null);
	const handleSearch = useSearchHandler(getEmojiPickerStore, setEmojiPickerStore);
	const searchAutoCompleteSuggestion = useSearchAutoComplete(
		searchInput,
		getEmojiPickerStore,
		selectedEmoji
	);
	const handleKeyDown = useSearchBarKeyDown(inputRef, searchAutoCompleteSuggestion, handleSearch);

	useSearchBarKeyboardFocus(inputRef);

	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
			setEmojiPickerStore({ autoFocus: false });
		}
	}, [autoFocus, setEmojiPickerStore]);

	return (
		<div className="px-[var(--emoji-picker-padding)] relative mt-2">
			<Search className="absolute left-[calc(var(--emoji-picker-padding)+0.5rem)] top-2.5 h-4 w-4 text-muted-foreground" />
			<div className="relative">
				{searchAutoCompleteSuggestion && (
					<Input
						className={cn(
							inputBaseClasses,
							'absolute text-muted-foreground bg-transparent border-transparent'
						)}
						value={searchAutoCompleteSuggestion}
						readOnly
					/>
				)}
				<Input
					ref={inputRef}
					className={cn(
						inputBaseClasses,
						'bg-transparent relative z-10',
						'focus-visible:ring-1 focus-visible:ring-offset-0'
					)}
					placeholder="Search emoji"
					value={searchInput}
					onChange={(e) => handleSearch(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</div>
	);
};
