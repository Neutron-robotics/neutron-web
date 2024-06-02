import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { makeStyles } from "@mui/styles"
import Markdown from "react-markdown"
import remarkGfm from 'remark-gfm'
import changelog from '../../data/changelog.json'

const useStyles = makeStyles(() => ({

}))

interface ChangelogDialogProps {
    open: boolean
    onClose: () => void
}

const ChangelogDialog = (props: ChangelogDialogProps) => {
    const { open, onClose } = props
    const classes = useStyles()
    const version = `v${import.meta.env.VITE_APP_VERSION}`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
        >
            <DialogTitle>{`Changelog - ${version}`}</DialogTitle>
            <DialogContent>
                <Markdown remarkPlugins={[remarkGfm]}>
                    {changelog.changelog}
                </Markdown>
            </DialogContent>
        </Dialog>
    )
}

export default ChangelogDialog