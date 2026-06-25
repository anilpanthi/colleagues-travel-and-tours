import CatchAllPage, { generateMetadata as generateCatchAllMetadata } from '../../[...slug]/page'

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
  return CatchAllPage(await toCatchAllArgs(args))
}

export async function generateMetadata(args: Args) {
  return generateCatchAllMetadata(await toCatchAllArgs(args))
}
