import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'

export const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode()
	const payload = await getPayload({ config: configPromise })

	const result = await payload.find({
		collection: 'pages',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slug,
			},
		},
	})

	return result.docs?.[0] || null
})

export const queryPackageBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode()
	const payload = await getPayload({ config: configPromise })

	const result = await payload.find({
		collection: 'packages',
		draft,
		limit: 1,
		overrideAccess: draft,
		pagination: false,
		where: {
			slug: {
				equals: slug,
			},
		},
	})

	return result.docs?.[0] || null
})

export const queryPages = cache(async () => {
	try {
		const payload = await getPayload({ config: configPromise })
		const pages = await payload.find({
			collection: 'pages',
			draft: false,
			limit: 1000,
			overrideAccess: false,
			pagination: false,
			select: {
				slug: true,
			},
		})
		return pages.docs || []
	} catch (error) {
		console.error('Error querying pages:', error)
		return []
	}
})

export const queryPackages = cache(async () => {
	try {
		const payload = await getPayload({ config: configPromise })
		const packages = await payload.find({
			collection: 'packages',
			draft: false,
			limit: 1000,
			overrideAccess: false,
			pagination: false,
			select: {
				slug: true,
			},
		})
		return packages.docs || []
	} catch (error) {
		console.error('Error querying packages:', error)
		return []
	}
})

export const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
	const payload = await getPayload({ config: configPromise })

	const result = await payload.find({
		collection: 'categories',
		limit: 1,
		pagination: false,
		overrideAccess: false,
		where: {
			slug: {
				equals: slug,
			},
		},
	})

	return result.docs?.[0] || null
})

