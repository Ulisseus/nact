import {
    nextUnitOfWork,
    wipRoot,
    assignVariable,
    VARIABLE_NAMES,
} from './variables';
import { commitRoot } from './commitRoot';

export const workLoop: IdleRequestCallback = (deadline) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        assignVariable(
            performUnitOfWork(nextUnitOfWork),
            VARIABLE_NAMES.nextUnitOfWork
        );
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    shouldYield = deadline.timeRemaining() < 1;
};
