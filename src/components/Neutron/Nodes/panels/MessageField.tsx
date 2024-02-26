import { InputAdornment, TextField, TextFieldProps } from "@mui/material"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    input: {
        paddingLeft: '0px',
        "& input": {
            fontSize: '12px',
        },
        '& > div:first-child': {
            paddingLeft: '0px',
        },
    },
}))

interface MessageFieldProps extends Omit<TextFieldProps, 'variant'> {

}

const MessageField = (props: MessageFieldProps) => {
    const { ...otherProps } = props
    const classes = useStyles()

    return (
        <TextField
            className={classes.input}
            InputProps={{
                startAdornment:
                    <InputAdornment
                        sx={{
                            backgroundColor: '#EBEBEB',
                            padding: `${otherProps.size === 'small' ? '19.5px' : '27.5px'} 5px`,
                        }}
                        position="start">
                        <div style={{ color: 'black', fontSize: '12px' }}>
                            msg.
                        </div>
                    </InputAdornment>,
            }}
            {...otherProps}
        />
    )
}

export default MessageField