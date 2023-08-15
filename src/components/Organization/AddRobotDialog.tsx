import { ButtonBase, Dialog, DialogContent, DialogTitle, Paper } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        "& div": {
            width: '150px',
            height: '150px',
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#f7f7f7',
            },
        }
    },
    icon: {
        width: '100px !important',
        height: '100px !important',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2
    },
    buttonTitle: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)'
    }
}))

export interface AddRobotDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

function AddRobotDialog(props: AddRobotDialogProps) {
    const { onClose, onConfirm, open, ...other } = props;
    const classes = useStyles()

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            onClose={onClose}
            {...other}
        >
            <DialogTitle>Add Robot</DialogTitle>
            <DialogContent dividers className={classes.root}>
                <ButtonBase onClick={() => onConfirm('blank')}>
                    <Paper>
                        <AddIcon className={classes.icon} />
                        <span className={classes.buttonTitle}>Blank</span>
                    </Paper>
                </ButtonBase>
                <ButtonBase onClick={() => onConfirm('connector')}>
                    <Paper>
                        <LinkIcon className={classes.icon} />
                        <span className={classes.buttonTitle}>Connector</span>
                    </Paper>
                </ButtonBase>
            </DialogContent>
        </Dialog>
    )
}

export default AddRobotDialog