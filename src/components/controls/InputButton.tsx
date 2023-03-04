import Button, { ButtonProps } from '@mui/material/Button';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

interface InputButtonProps extends ButtonProps {
    opacity: number
}

interface InputIconButtonProps extends IconButtonProps {
    opacity: number,
    iconStrokeWidth: number,
}

const InputButton = styled(Button)<InputButtonProps>(({ theme, opacity }) => ({
    "& .MuiButton-root": {
        opacity: `${opacity}`,
        border: `2 px solid ${theme.palette.primary.main}`
    }
}));

const InputIconButton = styled(IconButton)<InputIconButtonProps>(({ theme, opacity, iconStrokeWidth }) => ({
    "&.MuiIconButton-root": {
        border: `2px solid`,
        borderColor: theme.palette.primary.main
    },
    "& .MuiTouchRipple-root": {
        background: theme.palette.primary.main,
        filter: `opacity(${opacity})`,
    },
    "& .MuiSvgIcon-root": {
        stroke: 'black',
        fill: 'white',
        strokeWidth: `${iconStrokeWidth}px`,
        zIndex: 2
    }
}));



export { InputButton, InputIconButton }