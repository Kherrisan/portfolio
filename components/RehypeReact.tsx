import { slugify } from 'transliteration'
import NotionImage from './NotionImage';
import { Text } from './NotionTextBlock';
import Latex from 'react-latex-next'

export default function rehypeReact() {

    Object.assign(this, { Compiler: compiler })

    function compiler(node: any) {
        return (createElement(node))
    }

    function createText(node: any, index: number) {
        let text = { text: { content: node.value }, annotations: {} }
        if (node.annotations !== undefined) {
            text.annotations = {
                bold: node.annotations.includes('b'),
                italic: node.annotations.includes('i'),
                strikethrough: node.annotations.includes('s'),
                underline: node.annotations.includes('u'),
            }
        }
        return (<Text text={[text]} key={index}/>)
    }

    function createElement(node: any, index: number = 0) {
        if (node.annotations != undefined) {
            node.children?.forEach((child: any) => {
                child.annotations = Object.assign([], node.annotations);
                child.annotations.pushValues(node.properties?.className);
            });
        }
        if (node.type === 'root') {
            return node.children.map((child: any, index: number) => createElement(child, index));
        } else if (node.type === 'text') {
            return createText(node, index)
        } else if (node.tagName === 'i' || node.tagName === 'b' || node.tagName === 'u' || node.tagName === 's') {
            return node.children.map((child: any, index: number) => {
                if (child.annotations === undefined) child.annotations = [];
                child.annotations.push(node.tagName);
                return createElement(child, index);
            });
        }
        switch (node.tagName) {
            case 'h1':
                return (<h1
                    id={slugify(node.children[0].value)}
                    className="font-serif"
                    key={index}
                >
                    {node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}
                </h1>)

            case 'h2':
                return (<h2
                    id={slugify(node.children[0].value)}
                    className="font-serif"
                    key={index}
                >
                    {node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}
                </h2>)

            case 'h3':
                return (<h3
                    id={slugify(node.children[0].value)}
                    className="font-serif"
                    key={index}
                >
                    {node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}
                </h3>)

            case 'ol':
                return (<ol key={index}>
                    {node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}
                </ol>)

            case 'ul':
                return (<ul key={index}>
                    {node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}
                </ul>)

            case 'li':
                return (<li key={index}>
                    {node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}
                </li>)

            case 'p':
                return (<p key={index}>{node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}</p>)

            case 'section':
                return <Latex>{`\\[${node.children[0].value}\\]`}</Latex>

            case 'div':
                return (<div key={index}>{node.children.map((child: any, chIndex: number) => createElement(child, chIndex))}</div>)

            case 'img':
                return (<NotionImage value={node.properties} />)

            case 'span': 
                return node.properties?.className?.includes('math-inline') && (<Latex>{`\\(${node.children[0].value}\\)`}</Latex>)

            default:
                return (
                    <p>
                      `❌ Unsupported block ($
                      {JSON.stringify(node)})`
                    </p>
                  )
        }
    }
}