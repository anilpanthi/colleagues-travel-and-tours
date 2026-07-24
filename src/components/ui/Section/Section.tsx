import React from 'react'
import type { SectionBlock as SectionBlockProps } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import Container from '@/components/ui/Container'
import Row from '@/components/ui/Row'
import SubHeading from '@/components/ui/Subheading/Index'
import Heading from '@/components/ui/Heading/Index'
import Description from '@/components/ui/Description/Index'
import styles from './Section.module.scss'
import Image from 'next/image'

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

	return (
		<section className={styles.sectionBlock} data-motion-section="true" style={sectionStyle}>
			{backgroundType === 'image' && backgroundImage && typeof backgroundImage === 'object' && backgroundImage.url && (
				<>
					<Image
						alt={backgroundImage.alt || ''}
						className={styles.sectionBlock__image}
						fill
						quality={82}
						sizes="100vw"
						src={backgroundImage.url}
					/>
					<div className={styles.sectionBlock__imageOverlay} />
				</>
			)}
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
