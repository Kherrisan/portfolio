import Latex from 'react-latex-next'
import { slugify } from 'transliteration'
import Bookmark from './NotionBookmark'

import NotionImage from './NotionImage'
import { Text } from './NotionTextBlock'

const NotionBlock = (node: any) => {
  function createElement(node: any, index: number = 0) {
    if (node.annotations != undefined) {
      node.children?.forEach((child: any) => {
        child.annotations = Object.assign([], node.annotations)
        child.annotations = child.annotations.concat(node.properties?.className)
      })
    }
    if (node.type === 'root') {
      return node.children.map((child: any, chIndex: number) =>
        createElement(child, chIndex)
      )
    } else if (node.type === 'text') {
      return <Text text={node} key={index} />
    }
    switch (node.tagName) {
      case 'i':
      case 'b':
      case 'u':
      case 's':
      case 'a':
        return node.children.map((child: any, chIndex: number) => {
          if (child.annotations === undefined) child.annotations = []
          child.annotations.push(node.tagName)
          child.annotations = child.annotations.concat(node.properties?.className)
          child.annotations.push(node.properties?.href)
          return createElement(child, chIndex)
        })
      case 'h1':
        return (
          <h1
            id={slugify(node.children[0].value)}
            key={index}
          >
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </h1>
        )

      case 'h2':
        return (
          <h2
            className='my-5'
            id={slugify(node.children[0].value)}
            key={index}
          >
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </h2>
        )

      case 'h3':
        return (
          <h3
            id={slugify(node.children[0].value)}
            key={index}
          >
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </h3>
        )

      // case 'a':
      //   return <Text text={node} key={index} />

      case 'ol':
        return (
          <ol key={index}>
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </ol>
        )

      case 'ul':
        return (
          <ul key={index}>
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </ul>
        )

      case 'li':
        return (
          <li key={index}>
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </li>
        )

      case 'p':
        return (
          <p key={index}>
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </p>
        )

      case 'section':
        if (node.children.length === 1) {
          // equation block
          return <Latex key={index}>{`\\[${node.children[0].value}\\]`}</Latex>
        } else if (node.children.length === 2) {
          // callout block
          return (<div key={index} className='p-4 my-5 flex rounded-md bg-orange-100 dark:bg-stone-700'>
            <span className='pr-4'>{node.children[0].children[0].value}</span>
            <div className=''>{createElement(node.children[1])}</div>
          </div>)
        }

      case 'div':
        return (
          <div key={index}>
            {node.children.map((child: any, chIndex: number) =>
              createElement(child, chIndex)
            )}
          </div>
        )

      case 'img':
        return <NotionImage key={index} value={node.properties} />

      case 'span':
        if (node.properties.className.includes('math-inline')) {
          return <Latex key={index}>{`\\(${node.children[0].value}\\)`}</Latex>
        } else {
          return node.children.map((child: any, chIndex: number) => {
            if (child.annotations === undefined) child.annotations = []
            child.annotations.push(...node.properties.className)
            return createElement(child, chIndex)
          })
        }

      case 'bookmark':
        return <Bookmark key={index} value={node} />

      case 'audio':
        return <audio className='w-full my-4' controls style={{aspectRatio: '16 / 10'}} key={index} src={node.properties.src.url} />

      case 'iframe':
        return <iframe className='w-full my-4' style={{aspectRatio: '16 / 10'}} key={index} src={node.properties.src} />

      default:
        return (
          <code key={index}>{JSON.stringify(node)}</code>
        )
    }
  }

  function createText(textNode: any, index: number) {
    let text = { text: { content: textNode.value }, annotations: {} }
    if (textNode.annotations !== undefined) {
      text.annotations = {
        bold: textNode.annotations.includes('b'),
        italic: textNode.annotations.includes('i'),
        strikethrough: textNode.annotations.includes('s'),
        underline: textNode.annotations.includes('u'),
      }
    }
    return
  }

  return createElement(node)
}

export default NotionBlock
