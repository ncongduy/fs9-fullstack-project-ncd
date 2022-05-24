import { forwardRef, useContext } from 'react'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

import { GlobalContext } from '../../contexts'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function Announce() {
  const { announce, setAnnounce, statusAnnounce } = useContext(GlobalContext)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setAnnounce(false)
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={announce} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={statusAnnounce} sx={{ width: '100%' }}>
          Borrow book {statusAnnounce}!
        </Alert>
      </Snackbar>
    </Stack>
  )
}
export default Announce
