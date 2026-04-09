import React from 'react'
import type { SectionBlock as SectionBlockProps } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import Container from '@/components/ui/Container'
import Row from '@/components/ui/Row'
import SubHeading from '@/components/ui/Subheading/Index'
import Heading from '@/components/ui/Heading/Index'
import Description from '@/components/ui/Description/Index'
import styles from './Section.module.scss'

interface SectionProps {
	sectionData: SectionBlockProps
}

export default function Section({ sectionData }: SectionProps) {
	const {
		heading,
		subHeading,
		description,
		blocks,
		backgroundType,
		backgroundColor,
		backgroundImage,
	} = sectionData

	const sectionStyle: React.CSSProperties = {}

	if (backgroundType === 'color' && backgroundColor) {
		sectionStyle.backgroundColor = backgroundColor
	}

	if (backgroundType === 'image' && backgroundImage && typeof backgroundImage === 'object') {
		sectionStyle.backgroundImage = `linear-gradient(
			45deg,
			rgba(21, 21, 21, 0.3),
			rgba(29, 30, 30, 0.3),
			rgba(0, 0, 0, 0.3)
		), url(${backgroundImage.url})`
		sectionStyle.backgroundSize = 'cover'
		sectionStyle.backgroundRepeat = 'no-repeat'
		sectionStyle.backgroundPosition = 'center'
	} 

	return (
		<section className={styles.sectionBlock} style={sectionStyle}>
			<Container>
				<Row>
					<div className={styles.sectionBlock__header}>
						{subHeading && <SubHeading>{subHeading}</SubHeading>}
						{heading && <Heading>{heading}</Heading>}
						{description && <Description>{description}</Description>}
					</div>
				
					{blocks && blocks.length > 0 && <RenderBlocks blocks={blocks} />}

				</Row>
			</Container>
		</section>
	)
}
