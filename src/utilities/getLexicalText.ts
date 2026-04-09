interface LexicalNode {
    type?: string
    text?: string
    children?: LexicalNode[]
    [key: string]: unknown
}

export function getLexicalText(node: LexicalNode | string | null | undefined): string {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (node.type === 'text') return node.text || ''
    if (Array.isArray(node.children)) {
        const text = node.children.map(getLexicalText).join('')
        if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'listitem') {
            return text + '\n\n\n'
        }
        return text
    }
    return ''
}
