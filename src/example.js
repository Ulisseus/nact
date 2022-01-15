import { Nareact } from ".";

//changed to Nareact.creteElement by transpiler
/** @jsx Nareact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
//result of React.createElement is simple object of certain form
//const element = {
//type: "h1",
//props: {
//title: "foo",
//children: "hello",
//},
//};
const container = document.getElementById("root");
//ReactDom.render(element, container);
const node = document.createElement(element.type);
node["title"] = element.props.title;
const text = document.createTextNode("");
text["nodeValue"] = element.props.children;
node.appendChild(text);
container.appendChild(node);
//serve this as script to empty html page with container node
