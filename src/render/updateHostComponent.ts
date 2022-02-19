import { Fiber } from '../types';
import { reconsileChildren } from './recfonsileChildren';
import { createDom } from '../createDom';

export const updateHostComponent = (fiber: Fiber) => {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    reconsileChildren(fiber, fiber.props.children);
};
