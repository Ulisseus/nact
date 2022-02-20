import { wipFiber, hookIndex } from '../state';
import { assignStateVariable, currentRoot } from '../state';
import { Fiber, STATE_VARIABLES } from '../types';

export const useState = <T>(initial: T) => {
    const oldHook = wipFiber?.alternate?.hooks[hookIndex];
    const hook = { state: oldHook ? oldHook.state : initial, queue: [] };

    wipFiber.hooks.push(hook);
    assignStateVariable(hookIndex + 1, STATE_VARIABLES.hookIndex);

    const actions = oldHook ? oldHook.queue : [];

    actions.forEach((action: (args: T) => void) => {
        hook.state = action(hook.state);
    });
    const setState = (action: (args: T) => void) => {
        hook.queue.push(action);
        const wipRoot: Fiber = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
            child: null,
            parent: null,
            sibling: null,
            hooks: null,
            type: currentRoot.type,
        };
        assignStateVariable(wipRoot, STATE_VARIABLES.nextUnitOfWork);
        assignStateVariable([], STATE_VARIABLES.deletions);
    };

    return [hook.state, setState];
};
