import { makeStyles } from "@mui/styles"
import { IRobotPart } from "../../api/models/robot.model"
import { ButtonBase } from "@mui/material"
import { capitalize } from "../../utils/string"
import { buildFileUri } from "../../api/file"

const useStyles = makeStyles(() => ({
    partCard: {
        width: '250px',
        padding: '20px !important',
        borderRadius: '20px !important',
        display: 'flex',
        flexDirection: 'column',
        "&:hover": {
            background: '#f7f7f7'
        },
        "& img": {
            width: "80px",
        }
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column'
    }
}))

interface RobotCardProps {
    robotPart: IRobotPart
    onClick: (robotPart: IRobotPart) => void
}

const RobotPartCard = (props: RobotCardProps) => {
    const classes = useStyles()
    const { robotPart, onClick } = props

    return (
        <ButtonBase
            className={classes.partCard}
            onClick={() => onClick(robotPart)}
        >
            <img alt="part-avatar" src={robotPart.imgUrl?.length ? buildFileUri(robotPart.imgUrl) : `/assets/default-robotpart.png`} />
            <div className={classes.cardContent}>
                <span>{robotPart.name}</span>
                <span>{capitalize(robotPart.type)}</span>
            </div>
        </ButtonBase>
    )
}

export default RobotPartCard