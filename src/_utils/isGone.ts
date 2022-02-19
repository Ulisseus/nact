export const isGone =
    (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
        !(key in next);