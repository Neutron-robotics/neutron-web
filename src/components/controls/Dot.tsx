import { styled } from '@mui/material/styles';

const Dot = styled('div')<DotProps>(({ theme, success }) => ({
    width: '8px',
    height: '8px',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '50%',
    background: success ? theme.palette.success.main : theme.palette.error.main
}))

interface DotProps {
    success: boolean
}

export default Dot