'use client'

import { SiteSetting } from '@/payload-types'

interface SocialClientProps {
  data: SiteSetting['socialLinks']
}

export const SocialClient: React.FC<SocialClientProps> = ({ data }) => {
  return <h1>Hi Social</h1>
}
