import React from 'react'

import styles from 'ts/components/common/spinner.module.scss'

interface Props {
  smol: boolean
}

const Spinner: React.FC<Props> = ({ smol = false }) => {
  let classes = [styles.wrapper]

  if (smol) classes.push(styles.smol)
  // prettier-ignore
  return <div className={classes.join(' ')}>
    <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396.55 396.55">
      <rect x="66.09" y="66.09" width="66.09" height="66.09"/>
      <rect x="132.18" y="132.18" width="66.09" height="66.09"/>
      <rect x="66.09" y="198.28" width="66.09" height="66.09"/>
      <rect y="132.18" width="66.09" height="66.09"/>
      <rect x="330.46" y="132.18" width="66.09" height="66.09"/>
      <rect x="198.28" y="264.37" width="66.09" height="66.09"/>
      <rect x="264.37" y="198.28" width="66.09" height="66.09"/>
      <rect x="66.09" y="132.18" width="66.09" height="66.09"/>
      <rect x="132.18" y="264.37" width="66.09" height="66.09"/>
      <rect x="132.18" y="198.28" width="66.09" height="66.09"/>
      <rect x="198.28" y="132.18" width="66.09" height="66.09"/>
      <rect x="264.37" y="132.18" width="66.09" height="66.09"/>
      <rect x="198.28" y="198.28" width="66.09" height="66.09"/>
      <rect x="132.18" width="66.09" height="66.09"/>
      <rect x="198.28" y="66.09" width="66.09" height="66.09"/>
      <rect x="264.37" y="66.09" width="66.09" height="66.09"/>
      <rect x="198.28" y="330.46" width="66.09" height="66.09"/>
    </svg>
  </div>
}

export default Spinner
