import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IHeaderMenu } from "./Header";

const useStyle = makeStyles({
  headerMenu: {
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '20px',
    cursor: 'pointer',
    userSelect: 'none',
  },
})

interface IHeaderMenuProps extends IHeaderMenu {
  active: boolean
}

const HeaderMenu = (props: IHeaderMenuProps) => {
  const { title, onClose, onSetActive, active } = props;
  const classes = useStyle();

  const style = {
    backgroundColor: active ? '#525CD2' : '',
    width: active ? undefined : '200px',
  } as React.CSSProperties;

  return (
    <div className={classes.headerMenu} onClick={onSetActive} style={style}>
      <SmartToyIcon />
      <Typography
        style={{ color: "#FFFFFF", textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
        align="center"
        variant="h6"
        component="div"
        sx={{ flexGrow: 1 }}
      >
        {title}
      </Typography>
      <IconButton onClick={onClose} size="large" edge="end" color="inherit" aria-label="menu">
        <CloseIcon />
      </IconButton>
    </div>
  );
};

export default HeaderMenu;
