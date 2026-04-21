import React from 'react'
import { Media as MediaComponent } from '@/components/Media'
import styles from './Component.module.scss'
import { cn } from '@/utilities/ui'
import type { OurTeamBlock as OurTeamBlockProps } from '@/payload-types'

export const OurTeamBlock: React.FC<
  OurTeamBlockProps & {
    className?: string
  }
> = ({ members, className }) => {
  if (!members || members.length === 0) return null

  return (
    <div className={cn(styles.ourTeam, className)}>
      <div className={styles.grid}>
        {members.map((member, index) => (
          <div key={index} className={styles.memberCard}>
            <div className={styles.imageWrapper}>
              <MediaComponent resource={member.profilePicture} />
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{member.name}</span>
              <span className={styles.role}>{member.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
