import { useContext, useState } from 'react'
import classNames from 'classnames/bind'

import { GlobalContext } from '../../contexts'
import LoginByGoogle from '../../components/GoogleLogin'
import Topbar from '../../components/Topbar'
import Book from './components/Book'
import BookLoan from './components/BookLoan'
import Announce from '../../components/Announce'
import Error from '../../components/Error'

import styles from './styles.module.scss'

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
          {category === 'Book loan' && <BookLoan />}
          <Announce />
        </section>
      )}
    </main>
  )
}

export default HomePage
