import { getCachedGlobal } from './getGlobals'
import type { SiteSetting } from '@/payload-types'

export const getSiteSettings = async (): Promise<SiteSetting> => {
	return await getCachedGlobal('site-settings')()
}
