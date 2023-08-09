import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { OrganizationPermissions } from "../../utils/organization";
import { capitalize } from "../../utils/string";
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    textfield: {
        marginBottom: '10px !important'
    }
}))


export interface AddUserProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

function AddUserDialog(props: AddUserProps) {
    const { onClose, onConfirm, open, ...other } = props;
    const radioGroupRef = useRef<HTMLElement>(null);
    const [email, setEmail] = useState<string>("")
    const [role, setRole] = useState<string>("guest")
    const classes = useStyles()

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleRoleSelect = (event: SelectChangeEvent) => {
        setRole(event.target.value)
    }

    const handleEmailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handleSubmit = () => {
        onConfirm({
            role,
            email
        })
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>Add User</DialogTitle>
            <DialogContent dividers>
                <TextField
                    className={classes.textfield}
                    required
                    label="Email"
                    fullWidth
                    onChange={(e) => handleEmailSelect}
                />
                <Select
                    className={classes.textfield}
                    value={role}
                    label="Role"
                    fullWidth
                    onChange={handleRoleSelect}
                >
                    {Object.values(OrganizationPermissions).map(e => (
                        <MenuItem key={e} value={e}>{capitalize(e)}</MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddUserDialog