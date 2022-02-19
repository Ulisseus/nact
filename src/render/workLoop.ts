import {
    nextUnitOfWork,
    wipRoot,
    assignStateVariable,
} from '../state';
import { performUnitOfWork } from './performUnitOfWork';
import { STATE_VARIABLES } from '../types';
import { commitRoot } from './commitRoot';

export const workLoop: IdleRequestCallback = (deadline) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        assignStateVariable(
            performUnitOfWork(nextUnitOfWork),
            STATE_VARIABLES.nextUnitOfWork
        );
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    shouldYield = deadline.timeRemaining() < 1;
};
