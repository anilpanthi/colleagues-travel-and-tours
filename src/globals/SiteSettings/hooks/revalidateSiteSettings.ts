import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = async ({
	doc,
	req: { payload, context },
}) => {
	if (!context.disableRevalidate) {
		payload.logger.info(`Revalidating Site Settings Data..`)

		revalidateTag('global_site-settings', 'max')
		payload.logger.info(`Site Settings Data Revalidated`)
	}

	return doc
}
