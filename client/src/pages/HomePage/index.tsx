import { useContext, useState } from 'react'
import classNames from 'classnames/bind'

import { GlobalContext } from '../../contexts'
import LoginByGoogle from '../../components/GoogleLogin'
import Topbar from '../../components/Topbar'
import Book from './components/Book'
import Error from '../../components/Error'

import styles from './styles.module.scss'
import Announce from '../../components/Announce'

const cx = classNames.bind(styles)
const categories = ['Book', 'Book loan']

function HomePage() {
  const { user, error } = useContext(GlobalContext)
  const [category, setCategory] = useState('Book')

  if (error) {
    return <Error error={error} />
  }

  return (
    <main>
      {!user && (
        <section className={cx('wrapper')}>
          <div className={cx('container')}>
            <h2>Login</h2>
            <LoginByGoogle />
          </div>
        </section>
      )}

      {user && (
        <section>
          <Topbar categories={categories} onClick={setCategory} />
          {category === 'Book' && <Book />}
          {category === 'Book loan' && <h2>Render book loan</h2>}
          <Announce />
        </section>
      )}
    </main>
  )
}

export default HomePage
