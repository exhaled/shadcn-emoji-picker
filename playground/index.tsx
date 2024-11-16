import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { EmojiPicker } from '../src/components/EmojiPicker';
import { type EmojiPickerProps } from '../src/lib/store/store';
import { SkinTone } from '../src';
import { CustomGroup } from '../src/lib/constants';

const SKIN_TONE_OPTIONS = [
	[undefined, '🖐️'],
	[SkinTone.Light, '🖐🏻'],
	[SkinTone.MediumLight, '🖐🏼'],
	[SkinTone.Medium, '🖐🏽'],
	[SkinTone.MediumDark, '🖐🏾'],
	[SkinTone.Dark, '🖐🏿'],
] as const;

const DARK_MODE_OPTIONS = [
	[undefined, '⚙️'],
	[false, '🌞'],
	[true, '🌚'],
] as const;

const Playground = () => {
	const [store, setStore] = useState<EmojiPickerProps>({});

	// Hook to load data and set store
	// Normally, it should be loading from a database source.
	// For demo purpose, it is loading from hardcoded data.
	useEffect(() => {
		// Use default skin tone
		const skinTone = undefined;
		// Use system preference for dark mode
		const darkMode = undefined;
		// Frequently used emojis are shown on top of scroll pane when search input is empty
		const frequentlyUsedEmojis = ['👋', '🤩', '🫶', '🙏'];
		// Custom emoji keywords to augment keywords database
		// e.g. searching 'amazing' shows '🏆' emoji
		const customEmojiKeywords = {
			'🏆': ['amazing'],
		};
		// Custom preferred keyword to emoji match
		// e.g. searching 'amazing' ranks '💯' first
		const customKeywordMostRelevantEmoji = {
			amazing: '💯',
		};
		// Recently searched inputs are ranked higher for prefix match & autocomplete
		// e.g. searching 'h' ranks 'hello' first
		const recentlySearchedInputs = ['hello', 'amazing'];
		// Set user preferred emoji special variant for emojis with special variants
		// e.g. searching "family: parents, child" shows '👨‍👩‍👧' emoji
		const emojiToSpecialVariant = {
			'👨‍👩‍👦': '👨‍👩‍👧',
		};
		setStore({
			skinTone,
			darkMode,
			recentlySearchedInputs,
			frequentlyUsedEmojis,
			customEmojiKeywords,
			customKeywordMostRelevantEmoji,
			emojiToSpecialVariant,
		});
	}, []);

	return (
		<div className="flex flex-col items-center py-12 px-4 md:px-12">
			<div className="max-w-[380px] text-gray-600 text-sm">
				<p>👋Welcome to the Emoogle emoji picker playground</p>
				<p>⌨️Type words in input to search emojis blazingly fast</p>
				<p>➡️Use arrow keys to navigate</p>
				<p>
					↩️Press <kbd>Enter</kbd> or 🖱️click an emoji to copy it
				</p>
			</div>
			<div className="mt-8">
				<EmojiPicker
					autoFocus={true}
					skinTone={store.skinTone}
					darkMode={store.darkMode}
					onEmojiClick={(
						emojiVariant,
						resetEmojiPickerState,
						baseEmoji,
						group,
						searchInput
					) => {
						// Copy emoji to clipboard
						navigator.clipboard.writeText(emojiVariant);
						// Update recently searched input and custom keyword most relevant emoji
						// Note: baseEmoji should be used instead of emojiVariant
						if (searchInput) {
							setStore((prev) => ({
								...prev,
								recentlySearchedInputs: [
									searchInput,
									...(store.recentlySearchedInputs ?? []).filter(
										(input) => input !== searchInput
									),
								],
								customKeywordMostRelevantEmoji: {
									...store.customKeywordMostRelevantEmoji,
									[searchInput]: baseEmoji,
								},
							}));
						}
						// Update frequently used emojis (this is a simplified version and doesn't aggregate count)
						setStore((prev) => ({
							...prev,
							frequentlyUsedEmojis: [
								baseEmoji,
								...(prev.frequentlyUsedEmojis ?? []).filter(
									(emoji) => emoji !== baseEmoji
								),
							],
						}));
						// Update custom keywords
						if (searchInput && group !== CustomGroup.SearchResults) {
							setStore((prev) => ({
								...prev,
								customEmojiKeywords: {
									...store.customEmojiKeywords,
									[baseEmoji]: [
										searchInput,
										...(
											(store.customEmojiKeywords ?? {})[baseEmoji] ?? []
										).filter((keyword) => keyword !== searchInput),
									],
								},
							}));
						}
						// Reset emoji picker state
						resetEmojiPickerState();
					}}
					frequentlyUsedEmojis={store.frequentlyUsedEmojis}
					customEmojiKeywords={store.customEmojiKeywords}
					customKeywordMostRelevantEmoji={store.customKeywordMostRelevantEmoji}
					recentlySearchedInputs={store.recentlySearchedInputs}
				/>
			</div>
			<div className="mt-8">
				<div className="flex gap-4">
					<div className="flex gap-2">
						{SKIN_TONE_OPTIONS.map(([skinTone, emoji], idx) => (
							<div
								key={idx}
								onClick={() => {
									setStore((prev) => ({ ...prev, skinTone }));
								}}
								className={`cursor-pointer border rounded-full w-7 h-7 flex items-center justify-center ${
									store.skinTone === skinTone ? 'border-yellow-500' : ''
								}`}
							>
								{emoji}
							</div>
						))}
					</div>
					<hr className="h-7 border-l" />
					<div className="flex gap-2">
						{DARK_MODE_OPTIONS.map(([darkMode, emoji], idx) => (
							<div
								key={idx}
								onClick={() => {
									setStore((prev) => ({ ...prev, darkMode }));
								}}
								className={`cursor-pointer border rounded-full w-7 h-7 flex items-center justify-center ${
									store.darkMode === darkMode ? 'border-yellow-500' : ''
								}`}
							>
								{emoji}
							</div>
						))}
					</div>
				</div>
			</div>
			<p className="text-gray-600 text-sm mt-8 max-w-[360px]">
				😉If you like this playground, be sure to check out the{' '}
				<a href="https://www.emoogle.org/" className="underline">
					Emoogle desktop app
				</a>{' '}
				for the best emoji experience
			</p>
		</div>
	);
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Playground />
	</StrictMode>
);
