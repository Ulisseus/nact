import { Fiber, Element } from '../types';
import { createDom } from '../createDom';

let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;
let currentRoot: Fiber | null = null;
let deletions = null;
let wipFiber: Fiber | null = null;
let hookIndex: number | null = null;

const performUnitOfWork = (fiber: Fiber): Fiber => {
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

function updateDom(
    dom: Node,
    prevProps: Record<string, any>,
    nextProps: Record<string, any>
) {
    const isEvent = (key) => key.startsWith('on');
    const isProperty = (key) => key !== 'children' && !isEvent(key);
    const isNew = (prev, next) => (key) => prev[key] !== next[key];
    const isGone = (prev, next) => (key) => !(key in next);
    //todo switch to hashmap

    //remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            (key) => !(key in nextProps) || isNew(prevProps, nextProps)(key)
        )
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });

    //remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = '';
        });

    //set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = nextProps[name];
        });

    //add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
}

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

const reconsileChildren = (wipFiber: Fiber, elements: Fiber[]) => {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    while (index < elements.length || oldFiber !== null) {
        const element = elements[index];
        let newFiber = null;
        let prevSibling = wipFiber;
        const sameType = oldFiber && element && element.type == oldFiber.type;
        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: 'UPDATE',
            };
        }
        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: 'PLACEMENT',
            };
        }
        if (oldFiber && !sameType) {
            oldFiber.effectTag = 'DELETION';
            deletions.push(oldFiber);
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
};

const updateFunctionComponent = (fiber: Fiber) => {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];
    const children = [(fiber.type as Function)(fiber.props)];
    reconsileChildren(fiber, children);
};
const updateHostComponent = (fiber: Fiber) => {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    reconsileChildren(fiber, fiber.props.children);
};

const commitRoot = () => {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    //for reconsiliation
    currentRoot = wipRoot;
    wipRoot = null;
};

export const useState = (initial: any) => {
    const oldHook = wipFiber?.alternate?.hooks[hookIndex];
    const hook = { state: oldHook ? oldHook.state : initial };
    wipFiber.hooks.push(hook);
    hookIndex++;
    return [hook.state];
};

const workLoop: IdleRequestCallback = (deadline) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    shouldYield = deadline.timeRemaining() < 1;
};

window.requestIdleCallback(workLoop);
