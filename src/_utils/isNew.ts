export const isNew =
    (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
        prev[key] !== next[key];
