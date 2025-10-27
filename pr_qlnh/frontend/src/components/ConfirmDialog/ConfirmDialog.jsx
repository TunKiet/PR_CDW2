import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
    return (
        <>
            <Dialog open={open} onClose={onCancel}>
                <DialogTitle>{title || "Xác nhận"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button color="error" variant="contained" onClick={onConfirm}>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmDialog