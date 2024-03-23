import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles"
import { ChangeEvent, useState } from "react";

const useStyles = makeStyles(() => ({
    textfield: {
        marginBottom: '10px !important'
    },
}))

interface AddUserDialogProps {
    open: boolean;
    title?: string
    onClose: () => void;
    onConfirm: (data: any) => void;
}

const AddUserDialog = (props: AddUserDialogProps) => {
    const { title, onClose, onConfirm, open, ...other } = props;
    const classes = useStyles()
    const [email, setEmail] = useState('')

    function handleEmailValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setEmail(event.target.value)
    }

    function handleSubmit(): void {
        onConfirm(email)
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 600, minHeight: 500 } }}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <TextField
                    className={classes.textfield}
                    value={email}
                    placeholder="Email"
                    fullWidth
                    onChange={handleEmailValueChanged}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={email === ''} onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog >
    );
}

export default AddUserDialog