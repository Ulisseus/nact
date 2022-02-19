//v 0.1

const TEXT_ELEMENT_TYPE = 'TEXT_ELEMENT';

const isProperty = (key) => key !== 'children';

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) =>
                typeof child === 'object' ? child : createTextElement(child)
            ),
        },
    };
};

const createTextElement = (text) => {
    return {
        type: TEXT_ELEMENT_TYPE,
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

const render = (element, container) => {
    const dom =
        element.type === TEXT_ELEMENT_TYPE
            ? document.createTextNode('')
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

const element = createElement(
    'h1',
    {},
    'Hellow world!',
    createElement('button', {}, 'Button that does nothing')
);

const container = document.getElementById('root');

render(element, container);
