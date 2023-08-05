import { Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import React from 'react'
import { deleteUser } from '../../redux/action/user'
import { useDispatch } from 'react-redux'

const DeleteModal = ({ open, setOpen, userId }) => {

  ////////////////////////////////////// VARIABLES ///////////////////////////////////////
  const dispatch = useDispatch()

  ////////////////////////////////////// FUNCTIONS ///////////////////////////////////////
  const handleClose = () => {
    dispatch(deleteUser(userId))
    setOpen(false)
  }
  const handleDelete = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle id="alert-dialog-title">
        Delete the User?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog >
  )
}

export default DeleteModal