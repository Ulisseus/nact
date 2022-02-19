export type Element = {
    type: string;
    props: {
        nodeValue: string;
        children: Record<string, any>[] | void[];
    };
};

export type Fiber = {
    type: string | Function;
    props: Record<string, any> & { children: Fiber[] };
    child: Fiber | null;
    parent: Fiber | null;
    sibling: Fiber | null;
    alternate: Fiber | null;
    dom: Node | null;
    hooks: any[];
    effectTag?: string;
};
