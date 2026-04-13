import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateNavigation: CollectionAfterChangeHook = ({
	doc,
	req: { payload, context },
}) => {
	if (!context.disableRevalidate) {
		payload.logger.info(`Revalidating navigation: ${doc.name}`)

		revalidateTag('global_header', 'max')
		revalidateTag('global_site-settings', 'max')
	}

	return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { payload, context } }) => {
	if (!context.disableRevalidate) {
		payload.logger.info(`Revalidating navigation on delete: ${doc.name}`)
		revalidateTag('global_header', 'max')
		revalidateTag('global_site-settings', 'max')
	}

	return doc
}

