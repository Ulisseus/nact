import { Fiber } from '../types';
import { wipFiber, assignVariable, VARIABLE_NAMES } from './variables';
import { reconsileChildren } from './recfonsileChildren';

export const updateFunctionComponent = (fiber: Fiber) => {
    assignVariable(fiber, VARIABLE_NAMES.wipFiber);
    assignVariable(0, VARIABLE_NAMES.hookIndex);

    wipFiber.hooks = [];
    const children = [(fiber.type as Function)(fiber.props)];
    reconsileChildren(fiber, children);
};
