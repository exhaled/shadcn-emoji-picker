import {
	GROUP_TO_BASE_EMOJIS,
	EMOJI_TO_SKIN_TONE_VARIANTS,
	EMOJI_TO_SPECIAL_VARIANTS,
	CustomGroup,
} from './constants';

type GroupToBaseEmojis = typeof GROUP_TO_BASE_EMOJIS;
export type DataGroup = keyof GroupToBaseEmojis;

export type Group = CustomGroup | DataGroup;
// Nav bar excludes Search Results since it's only used for search functionality
export type NavBarGroup = Exclude<Group, CustomGroup.SearchResults>;

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
