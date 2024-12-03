import { createContext, useEffect, useRef, useContext } from 'react';
import {
	createEmojiPickerStore,
	type EmojiPickerProps,
	type EmojiPickerZustandStore,
} from './store';

const StoreContext = createContext<EmojiPickerZustandStore | null>(null);

/**
 * EmojiPickerStoreProvider is a ContextProvider that allows all the children components
 * access to the store, which includes both the props passed in and the internal state.
 *
 * The store is created with Zustand store and references the following implementation:
 * https://docs.pmnd.rs/zustand/guides/initialize-state-with-props
 */
export const EmojiPickerStoreProvider = ({
	children,
	...props
}: React.PropsWithChildren<EmojiPickerProps>) => {
	const store = useRef(createEmojiPickerStore(props)).current;

	useEffect(() => {
		store.setState({ ...props });
	}, [props]);

	return (
		<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
	);
};

// Export context through a hook instead of directly
export const useStoreContext = () => {
	const context = useContext(StoreContext);
	if (context === null) {
		throw new Error('useStoreContext must be used within a StoreProvider');
	}
	return context;
};
