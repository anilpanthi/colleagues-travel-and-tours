import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, PayloadRequest } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path) {
    return new Response('Missing path', { status: 400 })
  }

  // Check if user is authenticated
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return new Response('You are not logged in', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()

  return redirect(path)
}
