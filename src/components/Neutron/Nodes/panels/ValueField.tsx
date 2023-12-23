import { InputAdornment, MenuItem, Select, SelectChangeEvent, TextField, TextFieldProps } from "@mui/material";
import { makeStyles } from "@mui/styles"
import { ChangeEvent } from "react";

const useStyles = makeStyles(() => ({
    input: {
        width: '50%',
        paddingLeft: '0px',
        "& input": {
            fontSize: '12px',
            height: '25px'
        },

        '& > div:first-child': {
            paddingLeft: '0px',
        },
    },
    inputAdornment: {
        maxHeight: 'unset'
    },
    select: {
        background: '#EBEBEB',
        '& > div:first-child': {
            height: '0px',
        },
    }
}))

export type NeutronPrimitiveType = 'string' | 'number' | 'bool' | 'json' | 'env' | 'msg'

export interface IValueField {
    value?: number | string | boolean
    type: NeutronPrimitiveType
}

interface ValueFieldProps extends Omit<TextFieldProps, 'variant'> {
    value: IValueField
    onValueChanged?: (value: IValueField) => void
}

interface ValueIcon {
    value: NeutronPrimitiveType;
    label: string;
    icon?: string;
}

const iconOptions: ValueIcon[] = [
    { value: 'string', label: 'string', icon: 'string.svg' },
    { value: 'number', label: 'number', icon: 'number.svg' },
    { value: 'bool', label: 'boolean', icon: 'bool.svg' },
    { value: 'json', label: 'json', icon: 'json.svg' },
    { value: 'env', label: 'env', icon: 'env.svg' },
    { value: 'msg', label: 'msg' },
];

const ValueField = (props: ValueFieldProps) => {
    const { value, onValueChanged, ...otherProps } = props
    const classes = useStyles()

    const icon = iconOptions.find(e => e.value === value.type) ?? iconOptions[0]

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        const icon = iconOptions.find(e => e.value === event.target.value)
        if (icon && onValueChanged !== undefined)
            onValueChanged({ type: icon.value, value: value.value })
    }

    function handleValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (onValueChanged === undefined)
            return

        const updatedValue = value.type === 'number' ? +event.target.value : event.target.value
        onValueChanged({ type: value.type, value: updatedValue })
    }

    return (
        <TextField
            variant="outlined"
            value={value.value ?? false}
            type={
                value.type === 'number' ? 'number' :
                    value.type === 'bool' ? 'checkbox' :
                        'text'
            }
            className={classes.input}
            onChange={handleValueChanged}
            {...otherProps}
            sx={value.type === 'bool' ? {
                "> div > fieldset:first-of-type": {
                    height: '45px',
                    top: '-13px',
                    width: '100%'
                },
            } : undefined}
            InputProps={{
                startAdornment: (
                    <InputAdornment className={classes.inputAdornment} position="start">
                        <Select
                            onChange={handleSelectChange}
                            size={otherProps.size}
                            value={icon.value}
                            className={classes.select}
                            renderValue={() => (
                                icon.icon === undefined ?
                                    <div>{icon.label}</div>
                                    :
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/types/${icon.icon}`}
                                        alt={'select-icon'}
                                        height={20}
                                        width={20} />
                            )}
                        >
                            {iconOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <div style={{ display: 'flex' }}>
                                        {option.icon && (
                                            <img
                                                src={`${process.env.PUBLIC_URL}/assets/types/${option.icon}`}
                                                alt={'select-icon'}
                                                height={20}
                                                width={20} />
                                        )}
                                        <div>{option.label}</div>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </InputAdornment>
                ),
            }}
        >
        </TextField >
    );
};

export default ValueField