import CatchAllPage, { generateMetadata as generateCatchAllMetadata } from '../../[...slug]/page'
import { generatePath } from '@/utilities/generatePath'
import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const toCatchAllArgs = async ({ params }: Args) => {
  const { slug } = await params

  return {
    params: Promise.resolve({
      slug: slug ? [slug] : undefined,
    }),
  }
}

export default async function PackagePage(args: Args) {
  const { slug } = await args.params

  if (slug) {
    permanentRedirect(generatePath('packages', slug))
  }

  return CatchAllPage(await toCatchAllArgs(args))
}

export async function generateMetadata(args: Args) {
  return generateCatchAllMetadata(await toCatchAllArgs(args))
}
