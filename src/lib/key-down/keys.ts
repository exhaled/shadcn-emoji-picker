export enum Key {
    // Arrow keys
    Left = 'Left',
    Right = 'Right',
    Up = 'Up',
    Down = 'Down',
    // Other keys
    Enter = 'Enter',
}

export type ArrowKey = Key.Left | Key.Right | Key.Up | Key.Down;

export const isArrowKey = (key: string): key is ArrowKey => {
    return [Key.Left, Key.Right, Key.Up, Key.Down].some((arrowKey) => arrowKey === key);
};
