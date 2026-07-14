import PageTemplate, { generateMetadata } from './[...slug]/page'

// The production image does not require build-stage database connectivity. Keep the route
// dynamic so a transient build-time Payload miss cannot be persisted as a homepage 404;
// published document queries below are still backed by the tagged data cache.
export const dynamic = 'force-dynamic'
export const revalidate = 600

export default PageTemplate

export { generateMetadata }
