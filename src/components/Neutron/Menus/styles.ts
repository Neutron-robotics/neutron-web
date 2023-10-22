import { makeStyles } from "@mui/styles";

const useMenuStyles = makeStyles(() => ({
    rosComponentList: {
        paddingTop: '10px',
        paddingBottom: '10px',
        display: 'flex',
        "& > div": {
            marginLeft: '25px'
        }
    }
}))

export { useMenuStyles}