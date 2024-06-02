import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { makeStyles } from "@mui/styles"
import { parseRos2ServiceMessageContent } from "../../../utils/ros2";
import { v4 } from "uuid";
import { IRos2ServiceMessage } from "@neutron-robotics/neutron-core";

const useStyles = makeStyles(() => ({
    textfield: {
        marginBottom: '10px !important'
    },
    messageTextField: {
        "& .MuiInputBase-input": {
            fontFamily: "monospace", // Use a monospace font for code
            whiteSpace: "pre-wrap",   // Preserve line breaks
            fontSize: "12px", // Reduce the font size
            resize: "both",   // Allow resizing both horizontally and vertically
            overflow: "auto",
            maxHeight: '150px'
        },
    },
    msgDisplayContainer: {
        fontSize: "14px",
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '150px',
        overflowY: 'auto',
        '& div': {
            display: 'flex',
            justifyContent: 'space-around'
        }
    },
    msgDisplayHeader: {
        fontWeight: 'bold'
    }
}))


export interface AddServiceTypeDialogProps {
    open: boolean;
    title?: string
    onClose: () => void;
    onConfirm: (data: any) => void;
}

function AddServiceTypeDialog(props: AddServiceTypeDialogProps) {
    const { title, onClose, onConfirm, open, ...other } = props;
    const radioGroupRef = useRef<HTMLElement>(null);
    const [serviceType, setServiceType] = useState<IRos2ServiceMessage>({
        _id: v4(),
        name: "",
        request: [],
        response: []
    })
    const classes = useStyles()
    const [error, setError] = useState(false)

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleNameSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setServiceType(srv => ({ ...srv, name: event.target.value }))
    }

    const handleSubmit = () => {
        onConfirm(serviceType)
    }

    function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!event.target.value.length) {
            setError(false)
        }
        try {
            const f = parseRos2ServiceMessageContent(event.target.value)
            setServiceType(e => ({
                ...e,
                request: f.request,
                response: f.response
            }))
            setError(false)
        }
        catch {
            setError(true)
            setServiceType(e => ({
                ...e,
                request: [],
                response: []
            }))
        }
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 600, minHeight: 500 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <TextField
                    className={classes.textfield}
                    required
                    label="Service Type"
                    placeholder="my_msgs/srv/my_type"
                    fullWidth
                    onChange={handleNameSelect}
                />
                <TextField
                    className={classes.messageTextField}
                    required
                    label="msg file content"
                    multiline
                    minRows={4}
                    error={error}
                    fullWidth
                    onChange={handleFieldChange}
                />
                <div className={classes.msgDisplayContainer}>
                    {(serviceType.response.length > 0 || serviceType.request.length > 0) && (
                        <span style={{ fontWeight: 'bold' }}>Request</span>
                    )}
                    <div>
                        <div className={classes.msgDisplayHeader}>
                            Type
                        </div>
                        <div className={classes.msgDisplayHeader}>
                            Name
                        </div>
                    </div>
                    {serviceType.request.map((e, i) =>
                        <div key={i}>
                            <div>
                                {e.fieldname}
                            </div>
                            <div>
                                {e.fieldtype}
                            </div>
                        </div>
                    )}
                    {(serviceType.response.length > 0 || serviceType.request.length > 0) && (
                        <span style={{ fontWeight: 'bold' }}>Response</span>
                    )}
                    <div>
                        <div className={classes.msgDisplayHeader}>
                            Type
                        </div>
                        <div className={classes.msgDisplayHeader}>
                            Name
                        </div>
                    </div>
                    {serviceType.response.map((e, i) =>
                        <div key={i}>
                            <div>
                                {e.fieldname}
                            </div>
                            <div>
                                {e.fieldtype}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={error || (!serviceType.request.length && !serviceType.response.length)} onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog >
    );
}

export default AddServiceTypeDialog