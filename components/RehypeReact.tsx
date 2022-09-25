import NotionBlock from "./NotionBlock"

export default function rehypeReact() {

    Object.assign(this, { Compiler: compiler })

    function compiler(node: any) {
        return NotionBlock(node)
    }
}