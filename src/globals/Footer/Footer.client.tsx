'use client'

import React from 'react'
import type { SiteSetting } from '@/payload-types'
import styles from './Footer.module.scss'
import Container from '@/components/ui/Container'
import Link from 'next/link'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

interface FooterClientProps {
  footerColumns: SiteSetting['footerColumns']
  footerBottom: SiteSetting['footerBottom']
}

export const FooterClient: React.FC<FooterClientProps> = ({ footerColumns, footerBottom }) => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>Hellow Footy</div>
      </Container>
    </footer>
  )
}
