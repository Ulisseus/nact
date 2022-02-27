import { createTextElement } from './createTextElement';
import { Element } from '../types';

export const createElement = (
    type: string,
    props: Record<string, any> & { nodeValue: string },
    ...children: any[]
): Element => {
    return {
        type,

        props: {
            ...props,
            children: children.map((child) => {
                typeof child === 'object' ? child : createTextElement(child);
            }),
        },
    };
};
