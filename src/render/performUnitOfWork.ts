import { updateFunctionComponent } from './updateFunctionComponent';
import { updateHostComponent } from './updateHostComponent';
import { Fiber } from '../types';

export const performUnitOfWork = (fiber: Fiber): Fiber => {
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) updateFunctionComponent(fiber);
    else updateHostComponent(fiber);

    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
};
