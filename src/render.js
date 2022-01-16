import { TEXT_ELEMENT_TYPE } from "./constants";
export const render = (element, container) => {
  const dom =
    element.type === TEXT_ELEMENT_TYPE
      ? document.createTextNode("")
      : document.createElement(element.type);
  element.props.children.forEach((child) => {
    render(child, dom);
  });
  container.appendChild(dom);
};
