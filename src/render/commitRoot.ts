import { assignStateVariable, deletions, wipRoot } from '../state';
import { updateDom } from './updateDom';
import { Fiber, STATE_VARIABLES } from '../types';

const commitDeletion = (fiber: Fiber, domParent: Node) => {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else commitDeletion(fiber.child, domParent);
};

const commitWork = (fiber: Fiber) => {
    if (!fiber) {
        return;
    }
    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.dom;
    if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
        domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === 'DELETION') {
        commitDeletion(fiber.child, domParent);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
};

export const commitRoot = () => {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    //for reconsiliation
    assignStateVariable(wipRoot, STATE_VARIABLES.currentRoot);
    assignStateVariable(null, STATE_VARIABLES.wipRoot);
};
