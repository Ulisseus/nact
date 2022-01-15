const TEXT_ELEMENT_TYPE = "TEXT_ELEMENT";

const createTextElement = (text) => {
  return {
    type: TEXT_ELEMENT_TYPE,
    props: {
      nodeValue: text,
      children: [],
    },
  };
};
