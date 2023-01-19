import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IOperationTab } from "../../contexts/TabContext";
import React from "react";

const useStyle = makeStyles({
  tabheader: {
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '20px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'width .5s ease-in-out'
  },
})

const TabHeader = (props: IOperationTab) => {
  const { title, onClose, onSetActive, isActive } = props;
  const classes = useStyle();

  const handleOnClose = (e: any) => {
    e.stopPropagation()
    onClose()
  }

  const style = {
    backgroundColor: isActive ? '#525CD2' : '',
    width: isActive ? '200px' : '150px',
  } as React.CSSProperties;

  return (
    <div className={classes.tabheader} onClick={onSetActive} style={style}>
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
      <IconButton onClick={handleOnClose} size="large" edge="end" color="inherit" aria-label="close-tab">
        <CloseIcon />
      </IconButton>
    </div>
  );
};

export default TabHeader;
