'use client';
import '../styles.css';
import type { EmojiPickerProps } from '../lib/store/store';

import { EmojiPickerStoreProvider } from '../lib/store/StoreProvider';
import { GroupsNavBar } from './GroupsNavBar';
import { SearchBar } from './SearchBar';
import { ScrollPane } from './scroll-pane/ScrollPane';

import { useEmojiPickerSelector } from '../lib/store/hooks';
import { useEmojiPickerKeyDownProps } from '../lib/hooks/useEmojiPickerKeyDownProps';

/**
 * EmojiPicker is the parent component that provides a simple interface for emoji selection.
 * It manages all internal state and only exposes the necessary props for basic functionality.
 */
export const EmojiPicker = (props: React.PropsWithoutRef<EmojiPickerProps>) => {
	return (
		<EmojiPickerStoreProvider {...props}>
			<EmojiPickerCore />
		</EmojiPickerStoreProvider>
	);
};

const EmojiPickerCore = () => {
	const onBlur = useEmojiPickerSelector((state) => state.onBlur);
	const resetEmojiPickerState = useEmojiPickerSelector(
		(state) => state.resetEmojiPickerState
	);
	const { addKeyDownEventListener, removeKeyDownEventListener } =
		useEmojiPickerKeyDownProps();

	return (
		<div className={'dark'}>
			<article
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
				className="rounded-lg w-[var(--emoji-picker-width)] bg-white-ld outline-none border border-gray-700"
			>
				<GroupsNavBar />
				<SearchBar />
				<ScrollPane />
			</article>
		</div>
	);
};
