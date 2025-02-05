import { useEffect, useCallback } from 'react';
import { useEmojiPickerStore } from '../store/hooks';
import { handleKeyDown } from '../key-down/handle-key-down';
import { Key } from '../key-down/keys';
import { WEB_KEY_TO_KEY_DOWN_CONTROL_KEY, type WebKey } from '../constants';

/**
 * Return 2 props for the emoji picker: addKeyDownEventListener and removeKeyDownEventListener,
 * which are used to subscribe/unsubscribe to keydown events for emoji navigation.
 */
export const useEmojiPickerKeyDownProps = () => {
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	const keyDownEventCallback = useCallback((e: KeyboardEvent) => {
		const key = e.key;

		// Don't handle events if target is an input or if modifier keys are pressed
		if (e.target instanceof HTMLInputElement || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
			return;
		}

		if (key === 'Tab') {
			e.preventDefault();
			setEmojiPickerStore({ autoFocus: true });
			return;
		}

		if (key in WEB_KEY_TO_KEY_DOWN_CONTROL_KEY) {
			e.preventDefault();
			handleKeyDown(
				WEB_KEY_TO_KEY_DOWN_CONTROL_KEY[key as WebKey],
				getEmojiPickerStore,
				setEmojiPickerStore
			);
		} else if (key === 'Escape') {
			const store = getEmojiPickerStore();
			store.resetEmojiPickerState();
			const onEscapeKeyDown = store.onEscapeKeyDown;
			if (onEscapeKeyDown) {
				onEscapeKeyDown();
			}
		}
	}, []);

	const addKeyDownEventListener = () => {
		window.addEventListener('keydown', keyDownEventCallback);
	};

	const removeKeyDownEventListener = () => {
		window.removeEventListener('keydown', keyDownEventCallback);
	};

	useEffect(() => {
		return () => {
			removeKeyDownEventListener();
		};
	}, []);

	return { addKeyDownEventListener, removeKeyDownEventListener };
};
