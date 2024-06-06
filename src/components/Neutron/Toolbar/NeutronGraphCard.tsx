import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { INeutronGraph, INeutronGraphWithOrganization, INeutronGraphWithRobots } from "../../../api/models/graph.model"
import { buildFileUri } from "../../../api/file"

const useStyles = makeStyles(() => ({

}))

type INeutronGraphOpen = INeutronGraphWithOrganization & INeutronGraphWithRobots

interface NeutronGraphCardProps {
    graph: INeutronGraphOpen
    onCardClick: (graph: INeutronGraph) => void
}

const NeutronGraphCard = (props: NeutronGraphCardProps) => {
    const { graph, onCardClick } = props
    const classes = useStyles()

    return (
        <Card sx={{ maxWidth: 450, minWidth: 250 }}>
            <CardActionArea onClick={() => onCardClick({ ...graph, robot: graph.robot._id })}>
                <CardMedia
                    component="img"
                    height="100"
                    image={graph.imgUrl ? buildFileUri(graph.imgUrl) : `/assets/no-thumbnail.png`}
                    alt="graph view"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {graph.title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default NeutronGraphCard