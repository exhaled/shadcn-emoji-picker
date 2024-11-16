import { useEmojiPickerSelector } from '../lib/store/hooks';
import { getEmojiWithVariant } from '../lib/emoji-variants';

import { EMOJI_KEYWORDS, preProcessString } from 'emoogle-emoji-search-engine';
import { sortKeywordsInPlace } from '../lib/sort-keywords';

export const Preview = () => {
	const selectedEmoji = useEmojiPickerSelector((state) => state.selectedEmoji);
	const customEmojiKeywords =
		useEmojiPickerSelector((state) => state.customEmojiKeywords) ?? {};
	const skinTone = useEmojiPickerSelector((state) => state.skinTone);
	const emojiToSpecialVariant = useEmojiPickerSelector(
		(state) => state.emojiToSpecialVariant
	);
	const searchInput = useEmojiPickerSelector((state) => state.searchInput);
	const recentlySearchedInputs =
		useEmojiPickerSelector((state) => state.recentlySearchedInputs) ?? [];

	if (!selectedEmoji) {
		return (
			<section className="border-t-ld py-2 px-1.5">
				<div className="flex gap-1 items-center opacity-80 -mt-1">
					<div className="text-3xl select-none">
						{getEmojiWithVariant('☝️', skinTone, emojiToSpecialVariant)}
					</div>
					<div className="text-sm text-gray-600-ld min-h-[48px] flex items-center">
						Select an emoji to learn more
					</div>
				</div>
			</section>
		);
	}

	const baseEmoji = selectedEmoji.emoji;
	const emojiWithVariant = getEmojiWithVariant(
		baseEmoji,
		skinTone,
		emojiToSpecialVariant
	);

	const [emojiName = '', ...keywords] = (EMOJI_KEYWORDS[baseEmoji] ??
		[]) as string[];
	const customKeywords = customEmojiKeywords[baseEmoji] ?? [];
	const allKeywords = [...customKeywords, ...keywords];
	sortKeywordsInPlace(allKeywords, recentlySearchedInputs);
	allKeywords.sort((a, b) =>
		isSearchInputInKeyword(searchInput, a) ===
		isSearchInputInKeyword(searchInput, b)
			? 0
			: isSearchInputInKeyword(searchInput, a)
				? -1
				: 1
	);

	return (
		<section className="border-t-ld py-2 px-1.5">
			<div className="flex gap-1">
				<div className="text-3xl select-none text-gray-700-ld">
					{emojiWithVariant}
				</div>
				<div className="flex flex-col text-gray-500-ld min-h-[48px]">
					{/* The longest emoji name is "hand with index finger and thumb crossed" */}
					<div
						className="text-xs font-semibold capitalize line-clamp-1"
						title={emojiName}
					>
						<span
							className={
								isSearchInputInKeyword(searchInput, emojiName)
									? 'underline underline-offset-2'
									: undefined
							}
						>
							{emojiName}
						</span>
					</div>
					{/* The longest emoji keywords is "light bulb" */}
					<div className="text-xs line-clamp-2" title={allKeywords.join(', ')}>
						{allKeywords.map((keyword, idx) => (
							<span key={idx}>
								<span
									className={
										isSearchInputInKeyword(searchInput, keyword)
											? 'underline underline-offset-2'
											: undefined
									}
								>
									{keyword}
								</span>
								{idx !== allKeywords.length - 1 ? ', ' : ''}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

const isSearchInputInKeyword = (searchInput: string, keyword: string) => {
	searchInput = preProcessString(searchInput).trim();
	if (!searchInput) return false;
	keyword = preProcessString(keyword).trim();

	return searchInput.split(' ').every((searchInput) => {
		const words = keyword.split(' ');
		for (const word of words) {
			if (word.startsWith(searchInput)) {
				return true;
			}
		}
		return false;
	});
};
