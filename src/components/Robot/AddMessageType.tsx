import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, SelectChangeEvent, TextField, TextareaAutosize } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { OrganizationPermissions } from "../../utils/organization";
import { capitalize } from "../../utils/string";
import { makeStyles } from "@mui/styles"
import { IRos2Field, parseRos2MessageContent } from "../../utils/ros2";
import { v4 } from "uuid";

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
    }
}))


export interface AddMessageTypeProps {
    open: boolean;
    title?: string
    onClose: () => void;
    onConfirm: (data: any) => void;
}

function AddMessageType(props: AddMessageTypeProps) {
    const { title, onClose, onConfirm, open, ...other } = props;
    const radioGroupRef = useRef<HTMLElement>(null);
    const [name, setName] = useState<string>("")
    const [fields, setFields] = useState<IRos2Field[]>([])
    const classes = useStyles()
    const [error, setError] = useState(false)

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleNameSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleSubmit = () => {
        onConfirm({
            _id: v4(),
            name,
            fields
        })
    }

    function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!event.target.value.length) {
            setError(false)
        }
        try {
            const f = parseRos2MessageContent(event.target.value)
            setFields(f)
            setError(false)
        }
        catch {
            setError(true)
            setFields([])
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
                    label="Name"
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
                    {fields?.map((e, i) =>
                        <div key={i}>
                            <div>
                                {`Name: ${e.fieldname}`}
                            </div>
                            <div>
                                {`Type: ${e.fieldtype}`}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={error || !fields.length} onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog >
    );
}

export default AddMessageType