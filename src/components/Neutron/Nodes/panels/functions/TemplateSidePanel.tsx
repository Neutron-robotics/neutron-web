import { Button, Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, Suspense, forwardRef, lazy, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageField from "../MessageField"
import { Monaco } from "@monaco-editor/react"
import { TemplateNodeSpecifics } from "neutron-core"
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
    rangeForm: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: '20px',
        paddingBottom: '10px',
    },
    editorContainer: {
        margin: '20px',
        border: '1px solid black',
        borderRadius: '10px',
        height: '70%'
    },
    editor: {
        height: '100%',
        padding: '2px',
    },
    red: {
        color: 'red',
        background: 'yellow'
    }
}))

interface TemplateSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

const defaultSpecifics: TemplateNodeSpecifics = {
    propertyName: 'payload',
    template: 'This is the payload: {{payload}}'
}

const editorOptions: any = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    wordWrap: 'on',
    minimap: {
        enabled: false,
    }
};

const TemplateSidePanel = (props: TemplateSidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<TemplateNodeSpecifics>(node.id, defaultSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<TemplateNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handlePropertyValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics(prev => ({ ...prev, propertyName: event.target.value }))
    }

    function handleEditorChange(value: string | undefined): void {
        setLocalSpecifics(prev => ({ ...prev, template: value ?? '' }))
    }

    function handleEditorOnMount(_: any, monaco: Monaco): void {
        monaco.languages.setMonarchTokensProvider("plaintext", {
            tokenizer: {
                root: [
                    ['\{\{([^}]*)\}\}', 'matchedVariable']
                ],
            },
        });
        monaco.editor.defineTheme('TemplateEditorTheme', {
            base: 'vs',
            inherit: true,
            rules: [
                {
                    token: 'matchedVariable',
                    foreground: 'ad911d'
                }
            ],
            colors: {}
        });
        monaco.editor.setTheme('TemplateEditorTheme')
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Template</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.rangeForm}>
                        <MoreHorizIcon />
                        <span style={{ width: '70px' }}>Property</span>
                        <MessageField style={{ width: '330px' }} value={specificsLocal.propertyName} onChange={handlePropertyValueChanged} size='small' />
                    </div>
                    <div className={classes.editorContainer}>
                        <Suspense fallback={<div>loading editor</div>}>
                            <Editor
                                defaultLanguage="plaintext"
                                className={classes.editor}
                                value={specificsLocal.template}
                                onChange={handleEditorChange}
                                options={editorOptions}
                                onMount={handleEditorOnMount}
                            />
                        </Suspense>
                    </div>
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

export default forwardRef(TemplateSidePanel)