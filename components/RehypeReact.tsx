import { slugify } from 'transliteration'

export default function rehypeReact() {

    Object.assign(this, { Compiler: compiler })

    function compiler(node: any) {
        return (createElement(node))
    }

    function createElement(node: any) {
        if (node.type === 'root') {
            return node.children.map((child: any) => createElement(child));
        } else if (node.type === 'text') {
            return node.value;
        }
        switch (node.tagName) {
            case 'h1':
                return (<h1
                    id={slugify(node.children[0].value)}
                    className="font-serif"
                >
                    {node.children.map((child: any) => createElement(child))}
                </h1>)

            case 'h2':
                return (<h2
                    id={slugify(node.children[0].value)}
                    className="font-serif"
                >
                    {node.children.map((child: any) => createElement(child))}
                </h2>)

            case 'h3':
                return (<h3
                    id={slugify(node.children[0].value)}
                    className="font-serif"
                >
                    {node.children.map((child: any) => createElement(child))}
                </h3>)

            case 'ol':
                return (<ol>
                    {node.children.map((child: any) => createElement(child))}
                </ol>)

            case 'ul':
                return (<ul>
                    {node.children.map((child: any) => createElement(child))}
                </ul>)

            case 'li':
                return (<li>
                    {node.children.map((child: any) => createElement(child))}
                </li>)

            default:
                return 'Unimplemented: ' + JSON.stringify(node);
        }
    }
}