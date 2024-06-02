import { ButtonBase } from "@mui/material"
import { makeStyles } from "@mui/styles"
import AddIcon from '@mui/icons-material/Add';

const useStyles = makeStyles(() => ({
    partCard: {
        width: '250px',
        padding: '20px !important',
        borderRadius: '20px !important',
        display: 'flex',
        aspectRatio: 2,
        flexDirection: 'column',
        "&:hover": {
            background: '#f7f7f7'
        },
    },
}))

interface AddRobotPartCardProps {
    onClick: () => void
}

const AddRobotPartCard = (props: AddRobotPartCardProps) => {
    const { onClick } = props
    const classes = useStyles()

    return (
        <ButtonBase
            className={classes.partCard}
            onClick={onClick}
        >
            <AddIcon />
        </ButtonBase>
    )
}

export default AddRobotPartCard