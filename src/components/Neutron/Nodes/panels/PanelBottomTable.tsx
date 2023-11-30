import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent } from "react"
import { EditText, onSaveProps } from "react-edit-text"

const useStyles = makeStyles(() => ({
    panelRoot: {
        width: '100%'
    },
    title: {
        height: '50px',
        display: 'flex',
        border: '1px solid #CDCDCD',
        background: '#F4F4F4',
        padding: '10px',
        fontWeight: 'bold'
    },
    row: {
        display: 'flex',
        textAlign: 'center',
        "& > div:first-child": {
            fontWeight: 'bold',
            background: '#F4F4F4',
            width: '50%',
            border: '1px solid #CDCDCD'
        },
        "& > div:nth-child(2)": {
            width: '50%',
            border: '1px solid #CDCDCD',
            fontSize: '12px'
        },
    },
    intText: {
        color: '#61AFEF',
        fontFamily: 'Consolas, monospace',
    },
    stringText: {
        color: '#CE9178',
        fontFamily: 'Consolas, monospace',
    },

}))

export interface TableData {
    key: string,
    value?: string | number
    readonly?: boolean
    range?: string[]
}

interface PanelBottomTableProps {
    title: string,
    icon: string
    data: TableData[]
    onEditData: (data: TableData[]) => void
}

const PanelBottomTable = (props: PanelBottomTableProps) => {
    const { data, title, icon, onEditData } = props
    const classes = useStyles()

    const typeStyleDictionnary = (type: string) => {
        return {
            'string': classes.stringText,
            'number': classes.intText
        }[type] ?? ''
    }

    function handleValueUpdate(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowKey: string, isNew: boolean = false): void {
        const updatedData =
            isNew ? [...data, { key: rowKey, value: event.target.value }]
                : data.map((e) => e.key === rowKey ? { ...e, value: event.target.value } : e)
        onEditData(updatedData)
    }

    function handleKeyUpdate(event: onSaveProps, isNew: boolean = false): void {
        const updatedData = isNew ? [...data, { key: event.value, value: '' }]
            : data.map((e) => e.key === event.previousValue ? { ...e, key: event.value } : e)
        onEditData(updatedData)
    }

    function handleSelectChange(event: SelectChangeEvent<string | number>, rowKey: string): void {
        const updatedData = data.map((e) => e.key === rowKey ? { ...e, value: event.target.value } : e)
        onEditData(updatedData)
    }

    return (
        <div className={classes.panelRoot}>
            <div className={classes.title}>
                <img src={`${process.env.PUBLIC_URL}/assets/${icon}`} width={25} alt="node-icon" />
                <div style={{ marginLeft: '10px' }}>{title}</div>
            </div>
            <div>
                {data.map((row) =>
                    <div key={row.key} className={classes.row}>
                        <EditText
                            onSave={handleKeyUpdate}
                            defaultValue={row.key}
                            readonly={row.readonly}
                        />
                        {row.range && (
                            <Select
                                size='small'
                                value={row.value}
                                onChange={(e) => handleSelectChange(e, row.key)}
                            >
                                {row.range.map(e => (
                                    <MenuItem key={e} value={e}>{e}</MenuItem>
                                ))}
                            </Select>
                        )}
                        {typeof (row.value) === 'string' && !row.range && (
                            <EditText
                                className={typeStyleDictionnary(typeof (row.value))}
                                onChange={(e) => handleValueUpdate(e, row.key)}
                                value={`${row.value}`}
                                formatDisplayText={(e) => `"${e}"`}
                                readonly={row.readonly}
                            />
                        )}
                        {typeof (row.value) === 'number' && !row.range &&
                            (
                                <EditText
                                    className={typeStyleDictionnary(typeof (row.value))}
                                    onChange={(e) => handleValueUpdate(e, row.key)}
                                    value={`${row.value}`}
                                    readonly={row.readonly}
                                />
                            )}
                    </div>
                )}
                <div key={`newRecord-${data.length}`} className={classes.row}>
                    <EditText
                        onSave={(e) => handleKeyUpdate(e, true)}
                        defaultValue={''}
                    />
                    <EditText
                        onSave={(e) => handleValueUpdate({ target: { value: e.value } } as any, 'my_env', true)}
                        defaultValue={''}
                    />
                </div>
            </div>
        </div >
    )
}

export default PanelBottomTable