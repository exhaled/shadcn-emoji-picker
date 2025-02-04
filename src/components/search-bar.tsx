import { useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';
import {
	useEmojiPickerSelector,
	useEmojiPickerStore,
} from '../lib/store/hooks';
import { useSearchBarKeyboardFocus } from '../lib/hooks/useSearchBarKeyboardFocus';
import { useSearchAutoComplete } from '../lib/hooks/useSearchAutoComplete';
import { useSearchHandler } from '../lib/hooks/useSearchHandler';
import { CustomGroup } from '../lib/constants';

const inputBaseClasses = 'h-9 px-8 py-1';

/**
 * ShadcnSearchBar renders the search input field with auto-complete suggestions
 * using Shadcn UI components.
 */
export const SearchBar = () => {
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	const inputRef = useRef<HTMLInputElement>(null);
	const autoFocus = useEmojiPickerSelector((state) => state.autoFocus);

	const searchAutoCompleteSuggestion = useSearchAutoComplete(
		searchInput,
		getEmojiPickerStore,
		selectedEmoji
	);

	const handleSearch = useSearchHandler(
		getEmojiPickerStore,
		setEmojiPickerStore
	);

	useSearchBarKeyboardFocus(inputRef);

	useEffect(() => {
		if (autoFocus) {
			inputRef.current?.blur();
			inputRef.current?.focus();
		}
	}, [autoFocus]);

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
					onKeyDown={(e) => {
						const key = e.key;
						const caretPosition = (e.target as HTMLInputElement).selectionStart;

						const selectedEmoji = getEmojiPickerStore().selectedEmoji;
						const isFirstGroup =
							selectedEmoji?.group === CustomGroup.FrequentlyUsed ||
							selectedEmoji?.group === CustomGroup.SearchResults;
						const isFirstIdx = selectedEmoji?.idx === 0;
						const isFirstEmoji = isFirstGroup && isFirstIdx;

						if (key === 'ArrowUp' || key === 'ArrowDown') {
							e.preventDefault();
						} else if (key === 'ArrowLeft' && selectedEmoji && !isFirstEmoji) {
							e.preventDefault();
						} else if (
							key === 'ArrowRight' &&
							caretPosition !== searchInput.length
						) {
							e.stopPropagation();
						} else if (key === 'Tab' && searchAutoCompleteSuggestion) {
							e.preventDefault();
							handleSearch(searchAutoCompleteSuggestion);
						}
					}}
				/>
			</div>
		</div>
	);
};
