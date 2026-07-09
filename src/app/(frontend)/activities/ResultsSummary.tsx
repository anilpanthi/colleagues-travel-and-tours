import React from 'react'

import styles from './page.module.css'

type ResultsSummaryProps = {
  shownCount: number
  totalDocs: number
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ shownCount, totalDocs }) => {
  if (totalDocs === 0) {
    return <p className={styles.resultCount}>No activities are available right now.</p>
  }

  if (totalDocs === 1) {
    return <p className={styles.resultCount}>Showing 1 available activity.</p>
  }

  if (shownCount >= totalDocs) {
    return <p className={styles.resultCount}>Showing all {totalDocs} available activities.</p>
  }

  return (
    <p className={styles.resultCount}>
      Showing {shownCount} of {totalDocs} available activities.
    </p>
  )
}
