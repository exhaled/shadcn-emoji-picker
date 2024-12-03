import { useEffect } from 'react';
import { useEmojiPickerStore } from '../store/hooks';

export const useSearchBarKeyboardFocus = (
	inputRef: React.RefObject<HTMLInputElement>
) => {
	const { setEmojiPickerStore } = useEmojiPickerStore();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				return;
			}

			if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
				return;
			}

			inputRef.current?.focus();
			setEmojiPickerStore((state) => ({
				searchInput: (state.searchInput || '') + e.key,
			}));

			e.preventDefault();
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [inputRef, setEmojiPickerStore]);
};
