import { Button, Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, Suspense, forwardRef, lazy, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
// import Editor from '@monaco-editor/react';
const Editor = lazy(() => import('@monaco-editor/react'));

const useStyles = makeStyles(() => ({
    panelRoot: {
        width: '100%',
        height: '100%'
    },
    title: {
        textAlign: 'center',
        margin: '0',
        height: '30px',
    },
    panelBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100% - 30px)'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px'
    },
    editorContainer: {
        margin: '20px',
        border: '1px solid black',
        borderRadius: '10px',
        height: '80%'
    },
    editor: {
        height: '100%',
        padding: '2px',
    }
}))

interface FunctionSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

interface FunctionNodeSpecifics {
    code: string
}

const defaultSpecifics: FunctionNodeSpecifics = {
    code: `// Write there your own Typescript function to execute custom code.
// You can access the \`req\` object that contains this node input.
// The output of this node will be empty by default, but it is possible
// to define a customized output by returning an object

`,
}

const FunctionSidePanel = (props: FunctionSidePanelProps, ref: ForwardedRef<any>) => {
    const { node, onComplete, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<FunctionNodeSpecifics>(node.id, defaultSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<FunctionNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleEditorChange(value: string | undefined): void {
        console.log("value change", value)
        setLocalSpecifics({ code: value ?? '' })
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Function</h3>
            <div className={classes.panelBody}>
                <div className={classes.editorContainer}>
                    <Suspense fallback={<div>loading editor</div>}>
                        <Editor
                            className={classes.editor}
                            defaultLanguage="typescript"
                            value={specificsLocal.code}
                            onChange={handleEditorChange}
                        />
                    </Suspense>
                </div>
                <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onComplete}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveClick}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </Paper>
    )
}

export default forwardRef(FunctionSidePanel)