import { Box, Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { IMessageType } from "../../api/models/ros2.model";
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
import {
    IRos2Message,
    IRos2PartSystem,
    IRos2System,
    IRos2Topic,
} from "../../utils/ros2";
import ButtonDialog from "../controls/ButtonDialog";
import AddMessageType from "./AddMessageType";
import * as ros2Api from '../../api/ros2'
import { useAlert } from "../../contexts/AlertContext";

interface IRos2TableProps {
    ros2SystemModel: IRos2System;
    ros2PartModel: IRos2PartSystem;
}

interface RenderTypeEditProps extends GridRenderCellParams<any, string> {
    ros2Part: IRos2PartSystem
}

interface RenderTypeProps extends GridRenderCellParams<any, string> {
    ros2Part: IRos2PartSystem
}

const RenderTypeEdit = (props: RenderTypeEditProps) => {
    const { id, field, ros2Part } = props;
    const apiRef = useGridApiContext();

    useEffect(() => {
        apiRef.current.setEditCellValue({ id, field, value: ros2Part.messageTypes.length ? ros2Part.messageTypes[0]._id : '' });
    }, [])

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }

    return (
        <Select onChange={handleSelectChange} defaultValue={ros2Part.messageTypes.length ? ros2Part.messageTypes[0]._id : ''} fullWidth>
            {ros2Part.messageTypes.map((e) => (
                <MenuItem key={e._id} value={e._id}>
                    {e.name}
                </MenuItem>
            ))}
        </Select>
    );
};

const RenderType = (props: RenderTypeProps) => {
    const { ros2Part, value } = props;

    return (
        <div>
            {ros2Part.messageTypes.find(e => e._id === value)?.name ?? 'Unknown'}
        </div>
    )
}

const Ros2Table = (props: IRos2TableProps) => {
    const { ros2PartModel, ros2SystemModel } = props;
    const [ros2Part, setRos2Part] = useState(ros2PartModel);

    const [rows, setRows] = useState<IRos2Topic[]>(ros2Part.topics.map(e => ({ ...e, id: e._id, type: e.messageType._id })));
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const alert = useAlert()


    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCreateTypeClick = async (data: IRos2Message) => {
        if (ros2Part.messageTypes.includes(data)) {
            alert.warn("The message already exist...")
        }

        try {
            const id = await ros2Api.createMessageType(ros2SystemModel.robotId, ros2Part.partId, {
                message: {
                    name: data.name,
                    fields: data.fields
                }
            })
            data._id = id
            setRos2Part(e => ({
                ...e,
                messageTypes: [
                    ...e.messageTypes,
                    data
                ]
            }))
        }
        catch {
            alert.error("An error has occured while creating a message type")
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        console.log("Editing ", id, rowModesModel[id]);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }

    const handleDeleteClick = (id: GridRowId) => async () => {
        console.log("delete", id, rows.find((row) => (row as any).id === id))
        try {
            await ros2Api.deleteTopic(ros2SystemModel.robotId, ros2Part.partId, id as string)
            setRows(rows.filter((row) => (row as any).id !== id));
        }
        catch {
            alert.error("An error has occured while deleting a type")
        }
    };

    const handleCancelClick = (id: GridRowId) => () => {
        console.log("cancel", id)
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
        if (newRow.isNew) {
            try {
                console.log('create')
                await ros2Api.createTopic(ros2SystemModel.robotId, ros2Part.partId, {
                    name: updatedRow.name,
                    messageTypeId: updatedRow.type
                })
            }
            catch {
                alert.error("Failed to create a topic")
                return
            }
        }
        else {
            try {
                console.log('update')
                await ros2Api.updateSchemaType(ros2SystemModel.robotId, 'topic', {
                    topic: {
                        _id: updatedRow.id,
                        messageType: {
                            _id: updatedRow.type,
                        },
                        name: updatedRow.name,
                    }
                } as any)
            }
            catch {
                alert.error("Failed to update a topic")
            }
        }
        setRows(
            rows.map((row) => ((row as any).id === newRow.id ? updatedRow : row))
        );
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Topic Name",
            width: 150,
            editable: true,
            flex: 1,
        },
        {
            field: "type",
            headerName: "Topic type",
            width: 150,
            flex: 1,
            editable: true,
            renderEditCell: (params: GridRenderEditCellParams) => (
                <RenderTypeEdit {...params} ros2Part={ros2Part} />
            ),
            renderCell: (params: GridRenderCellParams) => (
                <RenderType {...params} ros2Part={ros2Part} />
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
                width: "80%",
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
                        handleCreateTypeClick,
                    },
                }}
            />
        </Box>
    );
};

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    handleCreateTypeClick: (data: IRos2Message) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, handleCreateTypeClick } = props;

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
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
            <ButtonDialog
                onConfirm={(data) => handleCreateTypeClick(data)}
                dialog={AddMessageType}
                dialogProps={{
                    title: "New Message Type",
                }}
            >
                <Button color="primary" startIcon={<AddIcon />}>
                    Add Type
                </Button>
            </ButtonDialog>
        </GridToolbarContainer>
    );
}

export default Ros2Table