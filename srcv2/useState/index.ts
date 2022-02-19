import { wipFiber,hookIndex } from "../state";
import { assignStateVariable } from "../state";
import { STATE_VARIABLES } from "../types";

export const useState = (initial: any) => {
    const oldHook = wipFiber?.alternate?.hooks[hookIndex];
    const hook = { state: oldHook ? oldHook.state : initial };
    wipFiber.hooks.push(hook);
    assignStateVariable(hookIndex+1,STATE_VARIABLES.hookIndex)
    return [hook.state];
};