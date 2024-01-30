import { IconButton, Menu, MenuItem } from "@mui/material";
import { IOperationCategoryFiltered, IOperationComponentDescriptorWithParts } from "../OperationComponents/IOperationComponents";
import { useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";
import NestedMenuItem from "../controls/NestedMenuItem";
import { IRobot } from "../../api/models/robot.model";

const useStyle = makeStyles((theme: any) => ({
    headerPartCard: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px'
    },
}))

interface ComponentMenuProps {
    mountComponent: (descriptor: IOperationComponentDescriptorWithParts, partId: string) => void;
    operationCategory: IOperationCategoryFiltered
    robot: IRobot
}

const ComponentMenu = (props: ComponentMenuProps) => {
    const classes = useStyle()
    const { operationCategory, robot, mountComponent } = props
    const { name, icon, components } = operationCategory
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const robotPartsNameDict: Record<string, string> = useMemo(() => robot.parts.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.name }), {}), [robot])

    const handleCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCategoryClose = () => {
        setAnchorEl(null);
    };

    const handleComponentSelected = (component: IOperationComponentDescriptorWithParts, partId: string) => {
        handleCategoryClose()
        mountComponent(component, partId)
    }

    return (
        <div className={classes.headerPartCard} title={name}>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label={`${name}-iconbtn`}
                sx={{ display: 'flex' }}
                onClick={handleCategoryClick}
            >
                <img src={`${process.env.PUBLIC_URL}/assets/components/${icon}`} width={25} alt="component-icon" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCategoryClose}
            >
                {components.map(e =>
                    e.parts.length === 1 ? (
                        <MenuItem
                            key={`mi-${e.name}-${e}`}
                            onClick={() => { handleComponentSelected(e, e.parts[0]) }}
                        >
                            {e.name}
                        </MenuItem>
                    ) : (
                        <NestedMenuItem
                            key={`mi-${e.name}-${e}`}
                            label={e.name}
                            parentMenuOpen={!!true}
                        >
                            {e.parts.map(part => (
                                <MenuItem
                                    key={part}
                                    onClick={() => handleComponentSelected(e, part)}
                                >
                                    {robotPartsNameDict[part]}
                                </MenuItem>
                            ))}
                        </NestedMenuItem>
                    )
                )}
            </Menu>
        </div >
    )
}

export default ComponentMenu