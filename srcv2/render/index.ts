import {  Fiber } from '../types';
import { workLoop } from './workLoop';
import { assignVariable, VARIABLE_NAMES, currentRoot } from '../variables';

export const render = (element:Fiber, container:Node) => {
    const wipRoot:Fiber = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
        hooks:[],
        child:null,
        parent:null,
        sibling:null,
        type:element.type

    };
    assignVariable(wipRoot, VARIABLE_NAMES.wipRoot)
    assignVariable([],VARIABLE_NAMES.deletions)
    assignVariable(wipRoot, VARIABLE_NAMES.nextUnitOfWork)
};

window.requestIdleCallback(workLoop);
