import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

const ModalXL = ({ children, button, title }) => {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div>
            <div
                style={{ zIndex: '20' }}
                onClick={() => {
                    handleClickOpen()
                }}
            >
                {button}
            </div>
            <Dialog fullScreen open={open} onClose={handleClose}>
                <DialogTitle style={{ borderBottom: '1px solid #000' }}>
                    {title}
                    <div
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '5px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            display: 'flex',
                            padding: 3,
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            handleClose()
                        }}
                    >
                        <CloseIcon
                            style={{ color: 'white', width: 14, height: 14 }}
                        />
                    </div>
                </DialogTitle>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        </div>
    )
}

export default ModalXL
