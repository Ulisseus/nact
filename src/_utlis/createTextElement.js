import { TEXT_ELEMENT_TYPE } from "../constants";

export const createTextElement = (text) => {
  return {
    type: TEXT_ELEMENT_TYPE,
    props: {
      nodeValue: text,
      children: [],
    },
  };
};
