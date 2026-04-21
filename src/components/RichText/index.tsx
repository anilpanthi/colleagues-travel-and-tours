import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
	DefaultNodeTypes,
	SerializedBlockNode,
	SerializedLinkNode,
	type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
	JSXConvertersFunction,
	LinkJSXConverter,
	RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
	BannerBlock as BannerBlockProps,
	CallToActionBlock as CTABlockProps,
	MediaBlock as MediaBlockProps,
	LegalDocumentsBlock as LegalDocumentsBlockProps,
	OurTeamBlock as OurTeamBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { LegalDocumentsBlock } from '@/blocks/LegalDocuments/Component'
import { OurTeamBlock } from '@/blocks/OurTeam/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
	| DefaultNodeTypes
	| SerializedBlockNode<
			CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps | LegalDocumentsBlockProps | OurTeamBlockProps
	  >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
	const doc = linkNode.fields?.doc
	if (!doc || !doc.value) {
		return '#'
	}
	const { value, relationTo } = doc
	if (typeof value !== 'object') {
		return '#'
	}
	const slug = value.slug
	return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
	...defaultConverters,
	...LinkJSXConverter({ internalDocToHref }),
	text: (args) => {
		const { node } = args
		if (typeof node.text === 'string' && node.text.includes('<iframe') && node.text.includes('</iframe>')) {
			// Render the text node as HTML if it contains an iframe.
			return <span dangerouslySetInnerHTML={{ __html: node.text }} />
		}
		// Fallback to default
		if (typeof defaultConverters.text === 'function') {
			return defaultConverters.text(args)
		}
		return <>{node.text}</>
	},
	blocks: {
		banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
		mediaBlock: ({ node }) => (
			<MediaBlock
				className="col-start-1 col-span-3"
				imgClassName="m-0"
				{...node.fields}
				captionClassName="mx-auto max-w-[48rem]"
				enableGutter={false}
				disableInnerContainer={true}
			/>
		),
		code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
		cta: ({ node }) => <CallToActionBlock {...node.fields} />,
		legalDocuments: ({ node }) => <LegalDocumentsBlock {...node.fields} />,
		ourTeam: ({ node }) => <OurTeamBlock {...node.fields} />,
	},
})

type Props = {
	data: DefaultTypedEditorState
	enableGutter?: boolean
	enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
	const { className, enableProse = true, enableGutter = true, style, ...rest } = props
	return (
		<div
			className={cn(
				'payload-richtext',
				{
					container: enableGutter,
					'max-w-none': !enableGutter,
					'mx-auto prose md:prose-md dark:prose-invert': enableProse,
				},
				className,
			)}
			style={style}
		>
			<ConvertRichText converters={jsxConverters} {...rest} />
		</div>
	)
}
