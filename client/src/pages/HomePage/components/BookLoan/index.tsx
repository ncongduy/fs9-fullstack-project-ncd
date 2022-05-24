import { useContext, useEffect, useState } from 'react'
import classNames from 'classnames/bind'

import { GlobalContext } from '../../../../contexts'
import bookLoanApi from '../../../../fetchApi/bookLoanApi'
import styles from './styles.module.scss'
import { Box, Button, Grid } from '@mui/material'

const cx = classNames.bind(styles)

function BookLoan() {
  const { setError, user, setAnnounce, setStatusAnnounce } = useContext(GlobalContext)
  const [bookLoans, setBookLoans] = useState<any>(null)
  const [bookLoansId, setBookLoansId] = useState<any>(null)
  const [status, setStatus] = useState<string>('')

  console.log('bookLoansId: ', bookLoansId)
  console.log('bookLoans: ', bookLoans)

  useEffect(() => {
    bookLoanApi
      .getAllBookLoans(user._id)
      .then((data: any) => {
        setBookLoans(data.allBooks)
        setBookLoansId(data.allBookloanId)
        setStatus('')
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setStatus('User does not borrow any book.')
        } else {
          setError('Can not load data.')
        }
      })
  }, [user, setError])

  const handleClick = (bookLoanId: any, bookId: any) => {
    bookLoanApi
      .returnBook(bookLoanId)
      .then(() => {
        setAnnounce(true)
        setStatusAnnounce('success')
      })
      .catch((err) => {
        setAnnounce(true)
        setStatusAnnounce('error')
      })

    const newBookLoansId = bookLoansId.filter((item: any) => item !== bookLoanId)
    const newBookLoans = bookLoans.filter((item: any) => item._id !== bookId)

    setBookLoansId(newBookLoansId)
    setBookLoans(newBookLoans)
  }

  return (
    <Box className={cx('container')}>
      <Grid container>
        {bookLoans &&
          bookLoans.map((book: any, index: any) => (
            <Grid key={book._id} item xs={12} sm={6} md={4} lg={3}>
              <div className={cx('item')}>
                <img src={book.image} alt="book" />
                <p>{book.title}</p>
                <Button
                  className={cx('button')}
                  color="secondary"
                  variant="contained"
                  onClick={() => handleClick(bookLoansId[index], book._id)}
                >
                  Return
                </Button>
              </div>
            </Grid>
          ))}

        {status && <h2>{status}</h2>}
      </Grid>
    </Box>
  )
}

export default BookLoan
