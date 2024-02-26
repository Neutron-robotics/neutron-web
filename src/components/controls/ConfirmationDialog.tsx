import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useRef } from "react";

export interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    title?: string
}

function ConfirmationDialog(props: ConfirmationDialogProps) {
    const { onClose, onConfirm, title, open, ...other } = props;
    const radioGroupRef = useRef<HTMLElement>(null);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={onConfirm}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog