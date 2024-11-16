import {
	GROUP_TO_BASE_EMOJIS,
	EMOJI_TO_SKIN_TONE_VARIANTS,
	EMOJI_TO_SPECIAL_VARIANTS,
	CustomGroup,
} from './constants';

type GroupToBaseEmojis = typeof GROUP_TO_BASE_EMOJIS;
export type DataGroup = keyof GroupToBaseEmojis;

export type Group = CustomGroup | DataGroup;
// Nav bar uses and shares the same icon for Search Results and Frequently Used
// so we exclude Frequently Used from NavBarGroup to avoid duplication
export type NavBarGroup = Exclude<Group, CustomGroup.FrequentlyUsed>;

export type BaseEmojiWithSkinToneVariants =
	keyof typeof EMOJI_TO_SKIN_TONE_VARIANTS;

type EmojiToSpecialVariants = typeof EMOJI_TO_SPECIAL_VARIANTS;
export type BaseEmojiWithSpecialVariants =
	keyof typeof EMOJI_TO_SPECIAL_VARIANTS;
export type EmojiToSpecialVariant = Partial<
	Record<
		BaseEmojiWithSpecialVariants,
		EmojiToSpecialVariants[BaseEmojiWithSpecialVariants][number]
	>
>;

export interface SelectedEmoji {
	group: Group;
	idx: number;
	emoji: string;
}
