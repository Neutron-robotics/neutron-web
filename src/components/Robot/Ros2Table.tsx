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

interface IRos2TableProps {
    ros2SystemModel: IRos2System;
    ros2PartModel: IRos2PartSystem;
}

interface RenderTypeProps extends GridRenderCellParams<any, string> {
    ros2Part: IRos2PartSystem
}

const RenderType = (props: RenderTypeProps) => {
    const { id, field, ros2Part } = props;
    const apiRef = useGridApiContext();

    useEffect(() => {
        apiRef.current.setEditCellValue({ id, field, value: ros2Part.messageTypes.length ? ros2Part.messageTypes[0].name : '' });
    }, [])

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        console.log("uodate", event)
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }


    return (
        <Select onChange={handleSelectChange} defaultValue={ros2Part.messageTypes.length ? ros2Part.messageTypes[0].name : ''} fullWidth>
            {ros2Part.messageTypes.map((e) => (
                <MenuItem key={e._id} value={e.name}>
                    {e.name}
                </MenuItem>
            ))}
        </Select>
    );
};

const Ros2Table = (props: IRos2TableProps) => {
    const { ros2PartModel, ros2SystemModel } = props;
    const [ros2Part, setRos2Part] = useState(ros2PartModel);

    const [rows, setRows] = useState<IRos2Topic[]>(ros2Part.topics);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCreateTypeClick = (data: IRos2Message) => {
        console.log("create r2", ros2Part, data);
        if (!ros2Part.messageTypes.includes(data))
            setRos2Part(e => ({
                ...e,
                messageTypes: [
                    ...e.messageTypes,
                    data
                ]
            }))
    };

    const handleEditClick = (id: GridRowId) => () => {
        console.log("Editing ", id, rowModesModel[id]);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        console.log("save", id)
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        console.log("delete", id)
        setRows(rows.filter((row) => (row as any).id !== id));
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

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false } as unknown as IRos2Topic;
        console.log("Process udpdate ", rows, newRow);
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
                <RenderType {...params} ros2Part={ros2Part} />
            ),
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

export default Ros2Table;
