import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { makeStyles } from "@mui/styles"
import { parseRos2ActionMessageContent } from "../../../utils/ros2";
import { v4 } from "uuid";
import { IRos2ActionMessage } from "@hugoperier/neutron-core";

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
    const [actionType, setActionType] = useState<IRos2ActionMessage>({
        _id: v4(),
        name: "",
        goal: [],
        feedback: [],
        result: []
    })
    const classes = useStyles()
    const [error, setError] = useState(false)
    const isActionDefined = actionType.goal.length > 0 || actionType.feedback.length > 0 || actionType.result.length > 0

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleNameSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActionType(act => ({ ...act, name: event.target.value }))
    }

    const handleSubmit = () => {
        onConfirm(actionType)
    }

    function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!event.target.value.length) {
            setError(false)
        }
        try {
            const f = parseRos2ActionMessageContent(event.target.value)
            setActionType(e => ({
                ...e,
                goal: f.goal,
                feedback: f.feedback,
                result: f.result
            }))
            setError(false)
        }
        catch {
            setError(true)
            setActionType(e => ({
                ...e,
                goal: [],
                feedback: [],
                result: []
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
                    {isActionDefined && (
                        <span style={{ fontWeight: 'bold' }}>Goal</span>
                    )}
                    <div>
                        <div className={classes.msgDisplayHeader}>
                            Type
                        </div>
                        <div className={classes.msgDisplayHeader}>
                            Name
                        </div>
                    </div>
                    {actionType.goal.map((e, i) =>
                        <div key={i}>
                            <div>
                                {e.fieldname}
                            </div>
                            <div>
                                {e.fieldtype}
                            </div>
                        </div>
                    )}
                    {isActionDefined && (
                        <span style={{ fontWeight: 'bold' }}>Feedback</span>
                    )}
                    <div>
                        <div className={classes.msgDisplayHeader}>
                            Type
                        </div>
                        <div className={classes.msgDisplayHeader}>
                            Name
                        </div>
                    </div>
                    {actionType.feedback.map((e, i) =>
                        <div key={i}>
                            <div>
                                {e.fieldname}
                            </div>
                            <div>
                                {e.fieldtype}
                            </div>
                        </div>
                    )}
                    {isActionDefined && (
                        <span style={{ fontWeight: 'bold' }}>Result</span>
                    )}
                    <div>
                        <div className={classes.msgDisplayHeader}>
                            Type
                        </div>
                        <div className={classes.msgDisplayHeader}>
                            Name
                        </div>
                    </div>
                    {actionType.result.map((e, i) =>
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
                <Button disabled={error || !isActionDefined} onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog >
    );
}

export default AddServiceTypeDialog