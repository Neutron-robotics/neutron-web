import { Box, Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    useGridApiContext,
    GridRenderCellParams,
    GridRenderEditCellParams,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import * as ros2Api from '../../../api/ros2'
import { useAlert } from "../../../contexts/AlertContext";
import useCachedState from "../../../utils/useCachedState";
import { IRos2Action, IRos2ActionMessage } from "neutron-core";
import ButtonDialog from "../../controls/ButtonDialog";
import AddActionTypeDialog from "./AddActionTypeDialog";

interface IActionTableProps {
    robotId: string
    partId: string
}

interface RenderTypeEditProps extends GridRenderCellParams<any, string> {
    actionTypes: IRos2ActionMessage[]
}

interface RenderTypeProps extends GridRenderCellParams<any, string> {
    actionTypes: IRos2ActionMessage[]
}

const RenderTypeEdit = (props: RenderTypeEditProps) => {
    const { id, field, actionTypes, row } = props;
    const apiRef = useGridApiContext();

    useEffect(() => {
        apiRef.current.setEditCellValue({ id, field, value: actionTypes.length ? row.actionTypeId ?? actionTypes[0]?._id : '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }

    return (
        <Select onChange={handleSelectChange} defaultValue={actionTypes.length ? row.actionTypeId ?? actionTypes[0]?._id : ''} value={row.actionTypeId ?? actionTypes[0]?._id} fullWidth>
            {actionTypes.map((e) => (
                <MenuItem key={e._id} value={e._id}>
                    {e.name}
                </MenuItem>
            ))}
        </Select>
    );
};

const RenderType = (props: RenderTypeProps) => {
    const { actionTypes, row } = props;

    return (
        <div>
            {actionTypes.find(e => e._id === row.actionTypeId)?.name ?? 'Unknown'}
        </div>
    )
}

const ActionTable = (props: IActionTableProps) => {
    const { robotId, partId } = props
    const [actionTypes, setActionType] = useCachedState<IRos2ActionMessage[]>(`actionTypes-${robotId}-${partId}`, [])
    const [actions, setActions] = useCachedState<IRos2Action[]>(`actions-${robotId}-${partId}`, [])
    const [rows, setRows] = useState<IRos2Action[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const alert = useAlert()

    useEffect(() => {
        setRows(actions.map(e => ({ ...e, id: e._id, actionTypeId: e.actionType._id })))
    }, [actions])

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCreateActionTypeClick = async (data: IRos2ActionMessage) => {
        if (actionTypes.includes(data)) {
            alert.warn("The action type already exist...")
        }

        try {
            const id = await ros2Api.createMessageType(robotId, partId, {
                action: {
                    name: data.name,
                    goal: data.goal,
                    feedback: data.feedback,
                    result: data.result,
                }
            })
            data._id = id
            setActionType([...actionTypes, data])
        }
        catch {
            alert.error("An error has occured while creating a action type")
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            await ros2Api.deleteAction(robotId, partId, id as string)
            setActions(actions.filter(e => e._id !== id))
        }
        catch {
            alert.error("An error has occured while deleting an action")
        }
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => (row as any).id === id);
        if ((editedRow as any).isNew) {
            setRows(rows.filter((row) => (row as any).id !== id));
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false } as any;
        const actionType = actionTypes.find(e => e._id === updatedRow.actionTypeId) as IRos2ActionMessage
        if (newRow.isNew) {
            try {
                const actionId = await ros2Api.createAction(robotId, partId, {
                    name: updatedRow.name,
                    actionTypeId: updatedRow.actionTypeId,
                })
                const action: IRos2Action = {
                    _id: actionId,
                    name: updatedRow.name,
                    actionType
                }
                setActions([...actions, action])
            }
            catch {
                alert.error("Failed to create an action")
                return
            }
        }
        else {
            try {
                await ros2Api.updateSchemaType(robotId, 'action', {
                    action: {
                        _id: updatedRow.id,
                        name: updatedRow.name,
                        actionType: {
                            _id: updatedRow.actionTypeId,
                        },
                    }
                } as any)
                const updatedAction: IRos2Action = {
                    _id: updatedRow.id as string,
                    name: updatedRow.name as string,
                    actionType
                }
                setActions(actions.map(e => e._id === updatedAction._id ? updatedAction : e))
            }
            catch {
                alert.error("Failed to update an action")
            }
        }
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Action Name",
            width: 150,
            editable: true,
            flex: 1,
        },
        {
            field: "actionTypeId",
            headerName: "Action type",
            width: 150,
            flex: 1,
            editable: true,
            renderEditCell: (params: GridRenderEditCellParams) => (
                <RenderTypeEdit {...params} actionTypes={actionTypes} />
            ),
            renderCell: (params: GridRenderCellParams) => (
                <RenderType {...params} actionTypes={actionTypes} />
            )
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    function handleProcessRowUpdateError(error: any): void {
        console.log("process error:", error)
    }

    return (
        <Box
            sx={{
                height: 400,
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: {
                        setRows,
                        setRowModesModel,
                        handleCreateActionTypeClick,
                        actionTypesLength: actionTypes.length
                    },
                }}
            />
        </Box>
    );
};

interface EditToolbarProps {
    actionTypesLength: number
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    handleCreateActionTypeClick: (data: IRos2ActionMessage) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { actionTypesLength, setRows, setRowModesModel, handleCreateActionTypeClick } = props;

    const handleClick = () => {
        const id = v4();
        setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }));
    };

    return (
        <GridToolbarContainer
            sx={{ display: "flex !important", justifyContent: "space-between" }}
        >
            <Button disabled={actionTypesLength === 0} color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
            <ButtonDialog
                onConfirm={(data) => handleCreateActionTypeClick(data)}
                dialog={AddActionTypeDialog}
                dialogProps={{
                    title: "New Action Type",
                }}
            >
                <Button color="primary" startIcon={<AddIcon />}>
                    Add Action
                </Button>
            </ButtonDialog>
        </GridToolbarContainer>
    );
}

export default ActionTable