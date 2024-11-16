'use client';
import { useState, useEffect } from 'react';
import '../styles.css';
import type { EmojiPickerProps } from '../lib/store/store';

import { EmojiPickerStoreProvider } from '../lib/store/StoreProvider';
import { GroupsNavBar } from './GroupsNavBar';
import { SearchBar } from './SearchBar';
import { ScrollPane } from './scroll-pane/ScrollPane';
import { Preview } from './Preview';

import { cx } from '../lib/cx';
import {
	useEmojiPickerSelector,
	useEmojiPickerStore,
} from '../lib/store/hooks';
import { useEmojiPickerKeyDownProps } from '../lib/hooks/useEmojiPickerKeyDownProps';

/**
 * EmojiPicker is the parent component.
 *
 * It is wrapped within a store context provider that gives children components
 * global access to the component store. Children can call the `useEmojiPickerSelector`
 * hook to subscribe to a store field.
 *
 * Because each EmojiPicker creates its own store, you can render multiple EmojiPickers
 * in the same page if desired.
 */
export const EmojiPicker = (props: React.PropsWithoutRef<EmojiPickerProps>) => {
	return (
		<EmojiPickerStoreProvider {...props}>
			<EmojiPickerCore />
		</EmojiPickerStoreProvider>
	);
};

/**
 * EmojiPickerCore is the core component of the emoji picker.
 *
 * All business logics should be added within this component since this
 * has access to component store.
 */
const EmojiPickerCore = () => {
	const darkMode = useEmojiPickerSelector((state) => state.darkMode);
	const hideBorder = useEmojiPickerSelector((state) => state.hideBorder);
	const { getEmojiPickerStore } = useEmojiPickerStore();
	const { addKeyDownEventListener, removeKeyDownEventListener } =
		useEmojiPickerKeyDownProps();

	const [darkModeSystemPreference, setDarkModeSystemPreference] =
		useState(false);
	useEffect(() => {
		setDarkModeSystemPreference(
			Boolean(window?.matchMedia('(prefers-color-scheme: dark)')?.matches)
		);
	}, []);

	return (
		<div
			className={(darkMode ?? darkModeSystemPreference) ? 'dark' : undefined}
		>
			<article
				className={cx(
					'rounded-lg w-[var(--emoji-picker-width)] bg-white-ld outline-none',
					!hideBorder && 'border'
				)}
				// tabIndex makes the EmojiPicker programmatically focusable to leverage onFocus & onBlur
				tabIndex={-1}
				onFocus={() => {
					addKeyDownEventListener();
				}}
				onBlur={(event) => {
					// Trigger onBlur only when focus is outside of EmojiPicker so it is okay to click inside EmojiPicker
					if (!event.currentTarget.contains(event.relatedTarget)) {
						removeKeyDownEventListener();
						const onBlur = getEmojiPickerStore().onBlur;
						if (onBlur) {
							onBlur(getEmojiPickerStore().resetEmojiPickerState);
						}
					}
				}}
			>
				<GroupsNavBar />
				<SearchBar />
				<ScrollPane />
				<Preview />
			</article>
		</div>
	);
};
