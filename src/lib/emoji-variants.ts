import { EMOJI_TO_SKIN_TONE_VARIANTS, SkinTone } from './constants';
import {
	type EmojiToSpecialVariant,
	type BaseEmojiWithSkinToneVariants,
} from './types';

const SKIN_TONE_TO_IDX: Record<SkinTone, number> = {
	[SkinTone.Light]: 0,
	[SkinTone.MediumLight]: 1,
	[SkinTone.Medium]: 2,
	[SkinTone.MediumDark]: 3,
	[SkinTone.Dark]: 4,
};

/**
 * Return the emoji with skin tone variant or special variant if it exists.
 *
 * This is used in 3 places to render the correct emoji variant:
 * 1. GroupPane
 * 2. Preview
 * 3. handle-key-down.ts
 */
export const getEmojiWithVariant = (
	baseEmoji: string,
	skinTone?: SkinTone,
	emojiToSpecialVariant?: EmojiToSpecialVariant
) => {
	if (emojiToSpecialVariant && baseEmoji in emojiToSpecialVariant) {
		return emojiToSpecialVariant[baseEmoji];
	}

	if (skinTone && baseEmoji in EMOJI_TO_SKIN_TONE_VARIANTS) {
		return EMOJI_TO_SKIN_TONE_VARIANTS[
			baseEmoji as BaseEmojiWithSkinToneVariants
		][SKIN_TONE_TO_IDX[skinTone]];
	}

	return baseEmoji;
};
