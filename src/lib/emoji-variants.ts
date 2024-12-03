import { type EmojiToSpecialVariant } from './types';

/**
 * Return the emoji with special variant if it exists.
 *
 * This is used in 3 places to render the correct emoji variant:
 * 1. GroupPane
 * 2. Preview
 * 3. handle-key-down.ts
 */
export const getEmojiWithVariant = (
	baseEmoji: string,
	emojiToSpecialVariant?: EmojiToSpecialVariant
) => {
	if (emojiToSpecialVariant && baseEmoji in emojiToSpecialVariant) {
		return emojiToSpecialVariant[baseEmoji];
	}

	return baseEmoji;
};
