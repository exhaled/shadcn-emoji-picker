import { CustomGroup, GROUP_TO_BASE_EMOJIS } from './constants';

type GroupToBaseEmojis = typeof GROUP_TO_BASE_EMOJIS;
export type DataGroup = keyof GroupToBaseEmojis;

export type Group = CustomGroup | DataGroup;
// Nav bar excludes Search Results since it's only used for search functionality
export type NavBarGroup = Exclude<Group, CustomGroup.SearchResults>;

export interface SelectedEmoji {
    group: Group;
    idx: number;
    emoji: string;
}
