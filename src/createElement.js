import { createTextElement } from "./_utlis/createTextElement";

export const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        typeof child === "object" ? child : createTextElement(child);
      }),
    },
  };
};
