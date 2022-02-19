import { Fiber } from './types';
import { isFiberOrNull } from './_utils/isFiberOrNull';
import { STATE_VARIABLES } from './types';

export let nextUnitOfWork: Fiber | null = null;
export let wipRoot: Fiber | null = null;
export let currentRoot: Fiber | null = null;
export let deletions = null;
export let wipFiber: Fiber | null = null;
export let hookIndex: number | null = null;

export const assignStateVariable = (
    variable: Fiber | null | number | number[],
    name: string
) => {
    switch (name) {
        case STATE_VARIABLES.nextUnitOfWork:
            if (isFiberOrNull(variable)) {
                nextUnitOfWork = variable;
            }

        case STATE_VARIABLES.deletions: {
            deletions = variable;
        }
        case STATE_VARIABLES.currentRoot:
            if (isFiberOrNull(variable)) {
                currentRoot = variable;
            }
        case STATE_VARIABLES.wipRoot:
            if (isFiberOrNull(variable)) {
                wipRoot = variable;
            }
        case STATE_VARIABLES.wipFiber: {
            if (isFiberOrNull(variable)) {
                wipFiber = variable;
            }
        }
        case STATE_VARIABLES.hookIndex: {
            if (typeof variable === 'number') {
                hookIndex = variable;
            }
        }
    }
};
