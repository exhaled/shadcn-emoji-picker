import { useContext } from 'react';
import { useStore } from 'zustand';

import type { EmojiPickerStore } from './store';

import { StoreContext } from './StoreProvider';

/**
 * Select and subscribe to a field from the component store, e.g.
 * `const hideBorder = useEmojiPickerSelector((state) => state.hideBorder);`
 *
 * This is similar to Redux's useSelector hook.
 */
export const useEmojiPickerSelector = <T>(
	selector: (state: EmojiPickerStore) => T
): T => {
	const store = useContext(StoreContext)!;
	return useStore(store, selector);
};

/**
 * Returns getEmojiPickerStore and setEmojiPickerStore functions to imperatively get and set the component store.
 *
 * Note: Unlike useEmojiPickerSelector, getEmojiPickerStore is imperative and does not subscribe to the store.
 */
export const useEmojiPickerStore = () => {
	const store = useContext(StoreContext)!;
	return {
		getEmojiPickerStore: store.getState,
		setEmojiPickerStore: store.setState,
	};
};
