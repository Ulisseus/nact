const isEvent = (key: string) => key.startsWith('on');
const isProperty = (key: string) => key !== 'children' && !isEvent(key);
const isNew =
    (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
        prev[key] !== next[key];
const isGone =
    (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
        !(key in next);

export const updateDom = (
    dom: Node,
    prevProps: Record<string, any>,
    nextProps: Record<string, any>
) => {
    //todo switch to hashmap

    //remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            (key) => !(key in nextProps) || isNew(prevProps, nextProps)(key)
        )
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });

    //remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = '';
        });

    //set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = nextProps[name];
        });

    //add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
};
