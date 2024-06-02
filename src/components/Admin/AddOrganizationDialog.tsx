import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextareaAutosize } from "@mui/material";
import { makeStyles } from "@mui/styles"
import { ChangeEvent, useState } from "react";

const useStyles = makeStyles(() => ({
    textfield: {
        marginBottom: '10px !important'
    },
}))

interface AddOrganizationDialogProps {
    open: boolean;
    title?: string
    onClose: () => void;
    onConfirm: (data: any) => void;
}

const AddOrganizationDialog = (props: AddOrganizationDialogProps) => {
    const { title, onClose, onConfirm, open, ...other } = props;
    const classes = useStyles()
    const [name, setName] = useState('')
    const [company, setCompany] = useState('')
    const [description, setDescription] = useState('')

    function handleNameValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setName(event.target.value)
    }
    function handleCompanyValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setCompany(event.target.value)
    }
    function handleDescriptionValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setDescription(event.target.value)
    }

    function handleSubmit(): void {
        onConfirm({
            name, company, description
        })
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
                    value={name}
                    placeholder="Name"
                    fullWidth
                    onChange={handleNameValueChanged}
                />
                <TextField
                    className={classes.textfield}
                    value={company}
                    placeholder="Company"
                    fullWidth
                    onChange={handleCompanyValueChanged}
                />
                <TextareaAutosize
                    style={{ width: '100%' }}
                    minRows={20}
                    className={classes.textfield}
                    value={description}
                    placeholder="Description"
                    onChange={handleDescriptionValueChanged}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={name === '' || company === ''} onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog >
    );
}

export default AddOrganizationDialog