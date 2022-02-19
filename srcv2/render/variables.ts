import { Fiber } from '../types';

export enum VARIABLE_NAMES {
    nextUnitOfWork = 'nextUnitOfWork',
    deletions = 'deletions',
    currentRoot = 'currentRoot',
    wipRoot = 'wipRoot',
    hookIndex = 'hookIndex',
    wipFiber = 'wipFiber',
}

export let nextUnitOfWork: Fiber | null = null;
export let wipRoot: Fiber | null = null;
export let currentRoot: Fiber | null = null;
export let deletions = null;
export let wipFiber: Fiber | null = null;
export let hookIndex: number | null = null;

const isFiberOrNull = (
    variable: Fiber | null | number|number[]
): variable is Fiber | null => {
    if((variable as any[]).length)return false
    return typeof variable !== 'number';
};

export const assignVariable = (
    variable: Fiber | null | number|number[],
    name: string
) => {
    switch (name) {
        case VARIABLE_NAMES.nextUnitOfWork:
            if (isFiberOrNull(variable)) {
                nextUnitOfWork = variable;
            }

        case VARIABLE_NAMES.deletions: {
            deletions = variable;
        }
        case VARIABLE_NAMES.currentRoot:
            if (isFiberOrNull(variable)) {
                currentRoot = variable;
            }
        case VARIABLE_NAMES.wipRoot:
            if (isFiberOrNull(variable)) {
                wipRoot = variable;
            }
        case VARIABLE_NAMES.wipFiber: {
            if (isFiberOrNull(variable)) {
                wipFiber = variable;
            }
        }
        case VARIABLE_NAMES.hookIndex: {
            if (typeof variable === 'number') {
                hookIndex = variable;
            }
        }
    }
};
