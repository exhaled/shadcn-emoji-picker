import { useEffect } from 'react';
import { useEmojiPickerStore } from '../store/hooks';

export const useSearchBarKeyboardFocus = (inputRef: React.RefObject<HTMLInputElement>) => {
  const { setEmojiPickerStore } = useEmojiPickerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if target is already an input element
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ignore modifier keys and special keys
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
        return;
      }

      // Focus the search input and simulate typing
      inputRef.current?.focus();
      setEmojiPickerStore((state) => ({
        ...state,
        searchInput: (state.searchInput || '') + e.key
      }));

      // Prevent default to avoid double input
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputRef, setEmojiPickerStore]);
}; 