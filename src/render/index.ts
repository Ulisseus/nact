import { Fiber, Element } from '../types';
import { workLoop } from './workLoop';
import { STATE_VARIABLES } from '../types';
import { assignStateVariable, currentRoot } from '../state';

export const render = (element: Element, container: Node) => {
    const wipRoot: Fiber = {
        dom: container,
        props: {
            children: [],
        },
        alternate: currentRoot,
        hooks: [],
        child: null,
        parent: null,
        sibling: null,
        type: element.type,
    };
    assignStateVariable(wipRoot, STATE_VARIABLES.wipRoot);
    assignStateVariable([], STATE_VARIABLES.deletions);
    assignStateVariable(wipRoot, STATE_VARIABLES.nextUnitOfWork);
};

window.requestIdleCallback(workLoop);
