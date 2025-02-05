'use client';
import '../styles.css';
import type { EmojiPickerProps } from '../lib/store/store';

import { EmojiPickerStoreProvider } from '../lib/store/StoreProvider';

import { useEmojiPickerSelector } from '../lib/store/hooks';
import { useEmojiPickerKeyDownProps } from '../lib/hooks/useEmojiPickerKeyDownProps';
import { ScrollPanel } from './scroll-pane/scroll-panel';
import { GroupsNavigation } from './groups-navigation';
import { SearchBar } from './search-bar';

const EmojiPickerCore = () => {
	const onBlur = useEmojiPickerSelector((state) => state.onBlur);
	const resetEmojiPickerState = useEmojiPickerSelector((state) => state.resetEmojiPickerState);
	const { addKeyDownEventListener, removeKeyDownEventListener } = useEmojiPickerKeyDownProps();

	return (
		<div
			tabIndex={-1}
			onFocus={() => {
				addKeyDownEventListener();
			}}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					removeKeyDownEventListener();
					if (onBlur) {
						onBlur(resetEmojiPickerState);
					}
				}
			}}
		>
			<SearchBar />
			<GroupsNavigation />
			<ScrollPanel />
		</div>
	);
};

/**
 * EmojiPicker is the parent component that provides a simple interface for emoji selection.
 * It manages all internal state and only exposes the necessary props for basic functionality.
 */
export const EmojiPickerEmpty = (props: React.PropsWithoutRef<EmojiPickerProps>) => {
	return (
		<EmojiPickerStoreProvider {...props}>
			<EmojiPickerCore />
		</EmojiPickerStoreProvider>
	);
};
