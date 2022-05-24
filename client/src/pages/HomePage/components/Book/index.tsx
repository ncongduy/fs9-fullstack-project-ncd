import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames/bind'
import { Box } from '@mui/system'
import { Grid } from '@mui/material'

import { GlobalContext } from '../../../../contexts'
import bookApi from '../../../../fetchApi/bookApi'
import styles from './styles.module.scss'

const cx = classNames.bind(styles)

function Book() {
  const { setError } = useContext(GlobalContext)
  const [books, setBooks] = useState<any>([])
  const navigage = useNavigate()

  useEffect(() => {
    bookApi
      .getAllBooks()
      .then((books) => setBooks(books))
      .catch((err) => setError('Can not load book.'))
  }, [setError])

  const handleClick = (bookId: any) => {
    navigage(`/book/${bookId}`)
  }

  return (
    <Box className={cx('container')}>
      <Grid container>
        {books.map((book: any, index: any) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <div onClick={() => handleClick(book._id)} className={cx('item')}>
              <img src={book.image} alt="book" />
              <p>{book.title}</p>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Book
