import fs from 'fs';
import stringify from 'json-stringify-pretty-compact';

/**
 * Script to create the 3 data json files from the Unicode emoji data file
 * group-to-base-emojis.json - mapping of 9 emoji groups to their base emojis
 * emoji-to-skin-tone-variants.json - mapping of 323 base emojis to their 5 skin tone variants
 * emoji-to-special-variants.json - mapping of 17 base emojis to their special variants
 */

/**
 * Unicode emoji data file URL. This is obtained from the following steps:
 * 1. Visit https://www.unicode.org/emoji/charts/
 * 2. Select "Emoji List"
 * 3. Select "Unicode Emoji data files" and redirect to https://unicode.org/Public/emoji/15.1/
 * 4. Copy link of "emoji-test.txt"
 */
const UNICODE_EMOJI_TEST_DATA_URL =
	'https://unicode.org/Public/emoji/15.1/emoji-test.txt';

const fetchText = async (url: string) => {
	const res = await fetch(url);
	const text = res.text();
	return text;
};

const createData = (emojiTestLines: string[]) => {
	const groupToBaseEmojis: Record<string, string[]> = {};
	let currentGroup = '';

	const emojiToSkinToneVariants: Record<string, string[]> = {};
	const emojiToFamilySpecialVariants: Record<string, string[]> = {
		'👨‍👩‍👦': [],
		'👨‍👩‍👧‍👦': [],
		'👩‍👦': [],
		'👩‍👧‍👦': [],
	};
	let lastBaseEmoji = '';

	for (const line of emojiTestLines) {
		if (line.startsWith('# group:')) {
			currentGroup = line.split(': ')[1];
			// Skip Component group
			if (currentGroup !== 'Component') {
				groupToBaseEmojis[currentGroup] = [];
			}
		}

		// Skip comments and empty lines
		if (line.startsWith('#') || line.trim() === '') {
			continue;
		}

		// Extract 5 props from each line: codePoints, status, emoji, version, name
		const [codePointsStatus, emojiVersionName] = line.split('# ');
		const codePointsStatusArray = codePointsStatus.split('; ');
		// codePoints (e.g. 1F600, 1F636 200D 1F32B FE0F)
		const codePoints = codePointsStatusArray[0].trim();
		// status (e.g. fully-qualified, minimally-qualified, unqualified)
		const status = codePointsStatusArray[1].trim();
		const emojiVersionNameArray = emojiVersionName.trim().split(' ');
		// emoji (e.g. 😀, 😶‍🌫)
		const emoji = emojiVersionNameArray[0].trim();
		// version (e.g. 1.0, 13.1)
		const version = emojiVersionNameArray[1].trim().slice(1);
		// name (e.g. grinning face, face in clouds)
		const name = emojiVersionNameArray.slice(2).join(' ');

		// Skip non-fully-qualified emojis
		if (status !== 'fully-qualified') {
			continue;
		}

		// Only keep 1 emoji from each of the 4 family variants
		// This is because family emojis start become silhouette style in March 2024 for Mac
		// Reference: https://www.mobiletechjournal.com/the-family-emojis-are-now-equally-useless-for-everyone/
		if (name.includes('family')) {
			// Discard the family emoji as it is duplicated by "👨‍👩‍👦"
			if (name === 'family') {
				continue;
			}

			// Add family variants to emojiToFamilySpecialVariants
			const [_, familyStr] = name.split(': ');
			const familyMembers = familyStr.split(', ');
			let numOfParents = 0;
			let numOfChildren = 0;
			for (const member of familyMembers) {
				if (['man', 'woman', 'adult'].includes(member)) {
					numOfParents++;
				} else if (['boy', 'girl', 'child'].includes(member)) {
					numOfChildren++;
				} else {
					throw new Error(`Unknown family member: ${member}`);
				}
			}
			if (numOfParents === 2 && numOfChildren === 1) {
				emojiToFamilySpecialVariants['👨‍👩‍👦'].push(emoji);
			} else if (numOfParents === 2 && numOfChildren === 2) {
				emojiToFamilySpecialVariants['👨‍👩‍👧‍👦'].push(emoji);
			} else if (numOfParents === 1 && numOfChildren === 1) {
				emojiToFamilySpecialVariants['👩‍👦'].push(emoji);
			} else if (numOfParents === 1 && numOfChildren === 2) {
				emojiToFamilySpecialVariants['👩‍👧‍👦'].push(emoji);
			} else {
				throw new Error(`Unknown family variant: ${name}`);
			}

			if (
				![
					'family: man, woman, boy',
					'family: man, woman, girl, boy',
					'family: woman, boy',
					'family: woman, girl, boy',
				].includes(name)
			) {
				continue;
			}
		}

		// Add skin tone variant emoji to emojiToSkinToneVariants
		// e.g. "👋": ["👋🏻", "👋🏼", "👋🏽", "👋🏾", "👋🏿"]
		// and exclude them from groupToBaseEmojis
		if (name.includes('skin tone')) {
			if (!emojiToSkinToneVariants[lastBaseEmoji]) {
				emojiToSkinToneVariants[lastBaseEmoji] = [];
			}
			emojiToSkinToneVariants[lastBaseEmoji].push(emoji);
			continue;
		}

		groupToBaseEmojis[currentGroup].push(emoji);
		lastBaseEmoji = emoji;
	}

	// Create emojiToSpecialVariants and update emojiToSkinToneVariants
	const emojiToSkinToneSpecialVariants: Record<string, string[]> = {};
	Object.entries(emojiToSkinToneVariants).forEach(
		([baseEmoji, skinToneVariants]) => {
			// There are 13 emojis that have 20 skin tone variants instead of normally 5.
			// We treat these as special variants and set them at emojiToSpecialVariants
			// e.g. "🤝": ["🤝🏻", "🫱🏻‍🫲🏼", "🫱🏻‍🫲🏽", "🫱🏻‍🫲🏾", "🫱🏻‍🫲🏿", "🫱🏼‍🫲🏻", "🤝🏼", "🫱🏼‍🫲🏽"...etc]
			// Additionally, we update and set only 5 skin tone variants at emojiToSkinToneVariants
			// for consistency, e.g. "🤝": ["🤝🏻", "🤝🏼", "🤝🏽", "🤝🏾", "🤝🏿"]
			if (skinToneVariants.length > 5) {
				let specialVariants = [...skinToneVariants];

				// Re-order 3 emojis so the order is consistent with the other 10 emojis
				if (['🤝', '💏', '💑'].includes(baseEmoji)) {
					const newSpecialVariants = [];
					for (let i = 0; i < 5; i++) {
						for (let j = 5; j < 9; j++) {
							if (j - i === 5) {
								newSpecialVariants.push(skinToneVariants[i]);
							}
							newSpecialVariants.push(skinToneVariants[i * 4 + j]);
						}
						if (i === 4) {
							newSpecialVariants.push(skinToneVariants[i]);
						}
					}
					specialVariants = newSpecialVariants;
				}

				emojiToSkinToneSpecialVariants[baseEmoji] = specialVariants;
				emojiToSkinToneVariants[baseEmoji] = [0, 6, 12, 18, 24].map(
					(index) => specialVariants[index]
				);
			}
		}
	);
	const emojiToSpecialVariants = {
		...emojiToSkinToneSpecialVariants,
		...emojiToFamilySpecialVariants,
	};

	return {
		groupToBaseEmojis,
		emojiToSkinToneVariants,
		emojiToSpecialVariants,
	};
};

(async () => {
	const emojiTestData = (await fetchText(
		UNICODE_EMOJI_TEST_DATA_URL
	)) as string;
	const emojiTestLines = emojiTestData.split('\n');
	const { groupToBaseEmojis, emojiToSkinToneVariants, emojiToSpecialVariants } =
		createData(emojiTestLines);
	fs.writeFileSync(
		'data/group-to-base-emojis.json',
		stringify(groupToBaseEmojis)
	);
	fs.writeFileSync(
		'data/emoji-to-skin-tone-variants.json',
		stringify(emojiToSkinToneVariants, { maxLength: 500, indent: 2 })
	);
	fs.writeFileSync(
		'data/emoji-to-special-variants.json',
		stringify(emojiToSpecialVariants, { maxLength: 500, indent: 2 })
	);
})();
