import { useState } from 'react'
import classNames from 'classnames/bind'

import LoginByGoogle from '../../components/GoogleLogin'
import Topbar from '../../components/Topbar'
import { UserDocument } from '../../types'
import styles from './styles.module.scss'

const cx = classNames.bind(styles)

function AdminPage() {
  const [user, setUser] = useState<UserDocument | null>(null)

  return (
    <main>
      {!user && (
        <section className={cx('wrapper-google')}>
          <div className={cx('container-icon')}>
            <h2>Login</h2>
            <LoginByGoogle onUser={setUser} />
          </div>
        </section>
      )}

      {user && (
        <section>
          <Topbar />
        </section>
      )}
    </main>
  )
}

export default AdminPage
