import { createTextElement } from './createTextElement';
import { Element } from '../types';

export const createElement = ({
    type,
    props,
    ...children
}: Element & any[]): Element => {
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
