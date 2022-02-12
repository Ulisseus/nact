import { Fiber } from '../types';
import { TEXT_ELEMENT_TYPE } from '../constants';
import { isProperty } from '../_utils/isProperty';

export const createDom = (fiber: Fiber) => {
    const dom =
        fiber.type == TEXT_ELEMENT_TYPE
            ? document.createTextNode('')
            : document.createElement(fiber.type as string);
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach((name) => {
            dom[name] = fiber.props[name];
        });
    return dom;
};
