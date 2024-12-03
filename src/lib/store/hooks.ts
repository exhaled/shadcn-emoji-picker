import { useStore } from 'zustand';
import type { EmojiPickerStore } from './store';
import { useStoreContext } from './StoreProvider';

/**
 * Select and subscribe to a field from the component store, e.g.
 * `const hideBorder = useEmojiPickerSelector((state) => state.hideBorder);`
 *
 * This is similar to Redux's useSelector hook.
 */
export const useEmojiPickerSelector = <T>(
	selector: (state: EmojiPickerStore) => T
): T => {
	const store = useStoreContext();
	return useStore(store, selector);
};

/**
 * Returns getEmojiPickerStore and setEmojiPickerStore functions to imperatively get and set the component store.
 *
 * Note: Unlike useEmojiPickerSelector, getEmojiPickerStore is imperative and does not subscribe to the store.
 */
export const useEmojiPickerStore = () => {
	const store = useStoreContext();
	return {
		getEmojiPickerStore: store.getState,
		setEmojiPickerStore: store.setState,
	};
};
