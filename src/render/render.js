import { createDom } from './createDom';

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;
let wipFiber = null;
let hookIndex = null;

export const render = (element, container) => {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
};

const workLoop = (deadline) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    shouldYield = deadline.timeRemaining() < 1;
};

const performUnitOfWork = (fiber) => {
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) updateFunctionComponent(fiber);
    else updateHostComponent(fiber);

    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    //todo consider recursion
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
};

const updateFunctionComponent = (fiber) => {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];
    const children = [fiber.type(fiber.props)];
    reconsileChildren(fiber, children);
};

export const useState = (initial) => {
    const oldHook = wipFiber?.alternate?.hooks[hookIndex];
    const hook = { state: oldHook ? oldHook.state : initial };
    wipFiber.hooks.push(hook);
    hookIndex++;
    return [hook.state];
};

const updateHostComponent = (fiber) => {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    reconsileChildren(fiber, fiber.props.children);
};

function updateDom(dom, prevProps, nextProps) {
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
const commitRoot = () => {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    //for reconsiliation
    currentRoot = wipRoot;
    wipRoot = null;
};

const reconsileChildren = (wipFiber, elements) => {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    while (index < elements.length || oldFiber !== null) {
        const element = elements[index];
        let newFiber = null;
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
const commitWork = (fiber) => {
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

const commitDeletion = (fiber, domParent) => {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else commitDeletion(fiber.child, domParent);
};

//calls window request idle callback when main thread is empty
//callback gets some free time object as argument
window.requestIdleCallback(workLoop);
