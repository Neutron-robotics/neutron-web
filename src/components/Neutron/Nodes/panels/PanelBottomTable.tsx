import { makeStyles } from "@mui/styles"

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

interface PanelBottomTableProps {
    title: string,
    icon: string
    data: {
        key: string,
        value?: string | number
    }[]
}

const PanelBottomTable = (props: PanelBottomTableProps) => {
    const { data, title, icon } = props
    const classes = useStyles()

    const typeStyleDictionnary = (type: string) => {
        return {
            'string': classes.stringText,
            'number': classes.intText
        }[type] ?? ''
    }

    return (
        <div className={classes.panelRoot}>
            <div className={classes.title}>
                <img src={`${process.env.PUBLIC_URL}/assets/${icon}`} width={25} alt="node-icon" />
                <div style={{ marginLeft: '10px' }}>{title}</div>
            </div>
            <div>
                {data.map((row) =>
                    typeof (row.value) === 'string' ? (
                        <div key={row.key} className={classes.row}>
                            <div>{row.key}</div>
                            <div className={typeStyleDictionnary(typeof (row.value))}>{`"${row.value}"`}</div>
                        </div>
                    ) : (
                        <div key={row.key} className={classes.row}>
                            <div>{row.key}</div>
                            <div className={typeStyleDictionnary(typeof (row.value))}>{`${row.value}`}</div>
                        </div>
                    ))}
            </div>
        </div >
    )
}

export default PanelBottomTable