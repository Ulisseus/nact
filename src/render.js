import { TEXT_ELEMENT_TYPE } from "./constants";
import { isProperty } from "./_utlis/isProperty";

export const render = (element, container) => {
  const dom =
    element.type === TEXT_ELEMENT_TYPE
      ? document.createTextNode("")
      : document.createElement(element.type);

  Object.keys(element.props)
    .filter(isProperty)
    .forEach((property) => {
      dom[property] = element.props[property];
    });

  element.props.children?.forEach((child) => {
    render(child, dom);
  });
  container.appendChild(dom);
};
