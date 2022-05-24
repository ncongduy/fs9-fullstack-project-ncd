import classNames from 'classnames/bind'

import styles from './styles.module.scss'

const cx = classNames.bind(styles)

type PropsType = {
  error: string | null
}

function Error({ error }: PropsType) {
  return (
    <main>
      <section className={cx('wrapper')}>
        <div className={cx('container')}>
          <h2>{error}</h2>
        </div>
      </section>
    </main>
  )
}

export default Error
