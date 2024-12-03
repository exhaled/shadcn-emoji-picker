'use client';
import { useState, useEffect } from 'react';
import '../styles.css';
import type { EmojiPickerProps } from '../lib/store/store';

import { EmojiPickerStoreProvider } from '../lib/store/StoreProvider';
import { GroupsNavBar } from './GroupsNavBar';
import { SearchBar } from './SearchBar';
import { ScrollPane } from './scroll-pane/ScrollPane';

import { cx } from '../lib/cx';
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
	const darkMode = useEmojiPickerSelector((state) => state.darkMode);
	const onBlur = useEmojiPickerSelector((state) => state.onBlur);
	const resetEmojiPickerState = useEmojiPickerSelector((state) => state.resetEmojiPickerState);
	const [darkModeSystemPreference, setDarkModeSystemPreference] = useState(false);
	const { addKeyDownEventListener, removeKeyDownEventListener } = useEmojiPickerKeyDownProps();

	useEffect(() => {
		setDarkModeSystemPreference(
			Boolean(window?.matchMedia('(prefers-color-scheme: dark)')?.matches)
		);
	}, []);

	return (
		<div className={(darkMode ?? darkModeSystemPreference) ? 'dark' : undefined}>
			<article
				tabIndex={-1}
				onFocus={() => {
					addKeyDownEventListener();
				}}
				onBlur={(event) => {
					// Trigger onBlur only when focus is outside of EmojiPicker so it is okay to click inside EmojiPicker
					if (!event.currentTarget.contains(event.relatedTarget)) {
						removeKeyDownEventListener();
						if (onBlur) {
							onBlur(resetEmojiPickerState);
						}
					}
				}}
				className="rounded-lg w-[var(--emoji-picker-width)] bg-white-ld border outline-none"
			>
				<GroupsNavBar />
				<SearchBar />
				<ScrollPane />
			</article>
		</div>
	);
};
