import { Fiber } from '../types';
import { wipFiber, assignStateVariable } from '../state';
import { STATE_VARIABLES } from '../types';
import { reconsileChildren } from './recfonsileChildren';

export const updateFunctionComponent = (fiber: Fiber) => {
    assignStateVariable(fiber, STATE_VARIABLES.wipFiber);
    assignStateVariable(0, STATE_VARIABLES.hookIndex);

    wipFiber.hooks = [];
    const children = [(fiber.type as Function)(fiber.props)];
    reconsileChildren(fiber, children);
};
