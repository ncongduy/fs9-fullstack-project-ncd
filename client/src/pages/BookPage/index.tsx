import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Paper } from '@mui/material'
import classNames from 'classnames/bind'

import Topbar from '../../components/Topbar'
import { GlobalContext } from '../../contexts'
import bookApi from '../../fetchApi/bookApi'
import bookLoanApi from '../../fetchApi/bookLoanApi'
import styles from './styles.module.scss'
import { Box } from '@mui/system'

const cx = classNames.bind(styles)

function BookPage() {
  const { bookId } = useParams()
  const [book, setBook] = useState<any>(null)
  const { user, setError, setAnnounce, setStatusAnnounce } = useContext(GlobalContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof bookId === 'undefined') return

    bookApi
      .getOneBook(bookId)
      .then((book) => setBook(book))
      .catch((err) => setError('Can not load book.'))
  }, [bookId, setError])

  const handleClick = async () => {
    const data = { bookId, userId: user._id }
    bookLoanApi
      .borrowBook(data)
      .then(() => {
        navigate('/')
        setAnnounce(true)
        setStatusAnnounce('success')
      })
      .catch((err) => {
        navigate('/')
        setAnnounce(true)
        setStatusAnnounce('error')
      })
  }

  return (
    <>
      <Topbar />
      <Box className={cx('wrapper')}>
        {book && (
          <Paper className={cx('container')} elevation={3}>
            <img src={book.image} alt="book" />
            <div>
              <p>
                <b>Title:</b> {book.title}
              </p>
              <p>
                <b>Author:</b> {book.author}
              </p>
              <p>
                <b>Rating:</b> {book.rating}
              </p>
              <p>
                <b>Pages:</b>
                {book.page}
              </p>
              <p>
                <b>Published year:</b> {book.publishedYear}
              </p>

              <Button className={cx('button')} variant="contained" onClick={handleClick}>
                Borrow
              </Button>
            </div>
          </Paper>
        )}
      </Box>
    </>
  )
}

export default BookPage
