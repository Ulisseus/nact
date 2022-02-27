import { useState } from './useState';
import { createElement } from './createElement';
import { render } from './render';

const Nact = {
    createElement,
    render,
    useState,
};

//todo move example into separate script
const element = createElement(
    'h1',
    { nodeValue: 'Hello, world!' },
    createElement('button', { nodeValue: 'Button that does nothing' })
);

const container = document.getElementById('root');

render(element, container);

export default Nact;
