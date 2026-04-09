// import type { Config } from 'src/payload-types'

// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
// import { unstable_cache } from 'next/cache'

// type Global = keyof Config['globals']

// async function getGlobal(slug: Global, depth = 0) {
//   const payload = await getPayload({ config: configPromise })

//   const global = await payload.findGlobal({
//     slug,
//     depth,
//   })

//   return global
// }

// /**
//  * Returns a unstable_cache function mapped with the cache tag for the slug
//  */
// export const getCachedGlobal = (slug: Global, depth = 0) =>
//   unstable_cache(async () => getGlobal(slug, depth), [slug], {
//     tags: [`global_${slug}`],
//   })

import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal<S extends Global>(slug: S, depth = 0): Promise<Config['globals'][S]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const global = await payload.findGlobal({
      slug,
      depth,
    })

    return global
  } catch (error) {
    console.error(`Error fetching global ${slug}:`, error)
    return {} as Config['globals'][S]
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <S extends Global>(slug: S, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
