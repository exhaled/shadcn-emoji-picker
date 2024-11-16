import { useEffect, useCallback } from 'react';
import { useEmojiPickerStore } from '../store/hooks';
import { handleKeyDown } from '../key-down/handle-key-down';
import { Key } from '../key-down/keys';

const WEB_KEY_TO_KEY_DOWN_CONTROL_KEY = {
	ArrowLeft: Key.Left,
	ArrowRight: Key.Right,
	ArrowUp: Key.Up,
	ArrowDown: Key.Down,
	Enter: Key.Enter,
} as const;
type WebKey = keyof typeof WEB_KEY_TO_KEY_DOWN_CONTROL_KEY;

/**
 * Return 2 props for the emoji picker: addKeyDownEventListener and removeKeyDownEventListener,
 * which are used to subscribe/unsubscribe to 6 keydown events (4 arrow keys, enter, escape)
 * to control emoji picker navigation, entering and exiting.
 *
 * Note
 * - We subscribe to keydown event because arrow key is only triggered on keydown
 */
export const useEmojiPickerKeyDownProps = () => {
	const { getEmojiPickerStore, setEmojiPickerStore } = useEmojiPickerStore();

	// It is important to use useCallback to memoize the event listener function,
	// so it doesn't get double added on re-renders, e.g. when props change.
	// Reference: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
	// 	"If the function or object is already in the list of event listeners for this target,
	// 	the function or object is not added a second time."
	const keyDownEventCallback = useCallback((e: KeyboardEvent) => {
		const key = e.key;
		if (key in WEB_KEY_TO_KEY_DOWN_CONTROL_KEY) {
			handleKeyDown(
				WEB_KEY_TO_KEY_DOWN_CONTROL_KEY[key as WebKey],
				getEmojiPickerStore,
				setEmojiPickerStore
			);
		} else if (key === 'Escape') {
			getEmojiPickerStore().resetEmojiPickerState();
			const onEscapeKeyDown = getEmojiPickerStore().onEscapeKeyDown;
			if (onEscapeKeyDown) {
				onEscapeKeyDown();
			}
		}
	}, []);

	const addKeyDownEventListener = () => {
		// Note: We attach event listener to window instead of document so search input can use
		// e.stopPropagation() correctly: https://github.com/facebook/react/issues/4335#issuecomment-421705171
		window.addEventListener('keydown', keyDownEventCallback);
	};

	const removeKeyDownEventListener = () => {
		window.removeEventListener('keydown', keyDownEventCallback);
	};

	// Clean up event listener when component unmounts
	useEffect(() => {
		return () => {
			removeKeyDownEventListener();
		};
	}, []);

	return { addKeyDownEventListener, removeKeyDownEventListener };
};
