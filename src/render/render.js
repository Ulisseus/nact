import { createDom } from "./createDom";

let nextUnitOfWork = null;
let wipRoot = null;

const commitRoot=()=> {
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
​
const commitWork = (fiber)=> {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

export const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork = wipRoot;
};

const workLoop = (deadline) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if(!nextUnitOfWork&&wipRoot){
    commitRoot()
  }
  shouldYield = deadline.timeRemaining() < 1;
};

//calls window request idle callback when main thread is empty
//callback gets some free time object as argument
 requestIdleCallback(workLoop);

/*

fiber should have pointers to parent, sibling and child (or nulls)

*/

const performUnitOfWork = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // if (fiber.parent) {
  //fiber.parent.dom.appendChild(fiber.dom);
  //}
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: elements.props,
      parent: fiber,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;

    //if fiber has a child return it, otherwise traverse siblings, if no siblings return parent
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
  }
};
