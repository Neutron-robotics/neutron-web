import { Dialog, DialogContent } from "@mui/material";
import { makeStyles } from "@mui/styles"
import { INeutronGraph } from "../../../api/models/graph.model";
import NeutronOpenGraph from "./NeutronOpenGraph";

const useStyles = makeStyles(() => ({
}))

export interface NeutronOpenDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

function NeutronOpenDialog(props: NeutronOpenDialogProps) {
    const { onClose, onConfirm, open, ...other } = props;
    const classes = useStyles()

    const handleGraphOpened = (graph: INeutronGraph) => {
        onConfirm(graph)
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '80%', minHeight: '70%' } }}
            open={open}
            onClose={onClose}
            {...other}
        >
            <DialogContent >
                <NeutronOpenGraph onGraphSelected={handleGraphOpened} />
            </DialogContent>
        </Dialog>
    )
}

export default NeutronOpenDialog