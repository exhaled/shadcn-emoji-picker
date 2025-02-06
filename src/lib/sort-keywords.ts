import { WORD_TO_TOP_1000_WORDS_IDX } from 'emoogle-emoji-search-engine';

/**
 * Sort keywords in place by recentlySearchedInputsIdx and top1000WordsIdx
 */
export const sortKeywordsInPlace = (keywords: string[], recentlySearchedInputs: string[]) => {
    const wordToRecentlySearchedInputIdx = recentlySearchedInputs.reduce(
        (acc, input, idx) => {
            acc[input] = idx;
            return acc;
        },
        {} as Record<string, number>
    );
    keywords.sort((a, b) => {
        const aRecentlySearchedInputIdx = wordToRecentlySearchedInputIdx[a];
        const bRecentlySearchedInputIdx = wordToRecentlySearchedInputIdx[b];

        if (aRecentlySearchedInputIdx !== bRecentlySearchedInputIdx) {
            if (aRecentlySearchedInputIdx === undefined) return 1;
            if (bRecentlySearchedInputIdx === undefined) return -1;
            return aRecentlySearchedInputIdx < bRecentlySearchedInputIdx ? -1 : 1;
        }

        const aTop1000WordsIdx = WORD_TO_TOP_1000_WORDS_IDX[a];
        const bTop1000WordsIdx = WORD_TO_TOP_1000_WORDS_IDX[b];
        if (aTop1000WordsIdx !== bTop1000WordsIdx) {
            if (aTop1000WordsIdx === undefined) return 1;
            if (bTop1000WordsIdx === undefined) return -1;
            return aTop1000WordsIdx < bTop1000WordsIdx ? -1 : 1;
        }

        return 0;
    });
};
