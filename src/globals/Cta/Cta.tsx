'use client'
import CtaStyle from './Cta.module.css'
import { Button } from '@/components/ui/Button/Button'
import { Plane } from 'lucide-react'

export default function Cta() {
  return (
    <Button appearance="primary" size="sm" iconLeft={<Plane className={CtaStyle.iconPlane} />}>
      Plan Your Trip
    </Button>
  )
}
