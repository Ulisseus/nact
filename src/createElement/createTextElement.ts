import { TEXT_ELEMENT_TYPE } from '../constants';
import { Element } from '../types';

export const createTextElement = (text: string): Element => {
    return {
        type: TEXT_ELEMENT_TYPE,
        props: {
            nodeValue: text,
            children: [],
        },
    };
};
