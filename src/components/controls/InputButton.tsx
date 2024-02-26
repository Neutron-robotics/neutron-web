import Button, { ButtonProps } from '@mui/material/Button';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

interface InputButtonProps extends ButtonProps {
    opacity: number
}

interface InputIconButtonProps extends IconButtonProps {
    opacity: number,
}

const InputButton = styled(Button)<InputButtonProps>(({ theme, opacity }) => ({
    "& .MuiButton-root": {
        opacity: `${opacity}`,
        border: `2 px solid ${theme.palette.primary.main}`
    }
}));

const InputIconButton = styled(IconButton)<InputIconButtonProps>(({ theme, opacity }) => ({
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
        zIndex: 2
    }
}));



export { InputButton, InputIconButton }