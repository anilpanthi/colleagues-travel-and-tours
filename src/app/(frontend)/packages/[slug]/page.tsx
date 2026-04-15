import { redirect } from 'next/navigation'

type Args = {
	params: Promise<{
		slug?: string
	}>
}

export default async function PackagePage({ params: paramsPromise }: Args) {
	const { slug } = await paramsPromise
	if (slug) {
		redirect(`/${slug}`)
	}
	redirect('/')
}
