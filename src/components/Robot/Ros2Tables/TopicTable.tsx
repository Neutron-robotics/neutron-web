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
import ButtonDialog from "../../controls/ButtonDialog";
import * as ros2Api from '../../../api/ros2'
import { useAlert } from "../../../contexts/AlertContext";
import useCachedState from "../../../utils/useCachedState";
import { IMessageType, IRos2Message, IRos2Topic } from "neutron-core";
import AddMessageTypeDialog from "./AddMessageTypeDialog";

interface ITopicTableProps {
    robotId: string
    partId: string
}

interface RenderTypeEditProps extends GridRenderCellParams<any, string> {
    messageTypes: IMessageType[]
}

interface RenderTypeProps extends GridRenderCellParams<any, string> {
    messageTypes: IMessageType[]
}

const RenderTypeEdit = (props: RenderTypeEditProps) => {
    const { id, field, messageTypes, row } = props;
    const apiRef = useGridApiContext();

    useEffect(() => {
        apiRef.current.setEditCellValue({ id, field, value: messageTypes.length ? row.type ?? messageTypes[0]?._id : '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }

    return (
        <Select onChange={handleSelectChange} defaultValue={messageTypes.length ? row.type ?? messageTypes[0]?._id : ''} value={row.type ?? messageTypes[0]?._id} fullWidth>
            {messageTypes.map((e) => (
                <MenuItem key={e._id} value={e._id}>
                    {e.name}
                </MenuItem>
            ))}
        </Select>
    );
};

const RenderType = (props: RenderTypeProps) => {
    const { messageTypes, value } = props;

    return (
        <div>
            {messageTypes.find(e => e._id === value)?.name ?? 'Unknown'}
        </div>
    )
}

const TopicTable = (props: ITopicTableProps) => {
    const { robotId, partId } = props
    const [messageTypes, setMessageTypes] = useCachedState<IRos2Message[]>(`messageTypes-${robotId}-${partId}`, [])
    const [topics, setTopics] = useCachedState<IRos2Topic[]>(`topics-${robotId}-${partId}`, [])
    const [rows, setRows] = useState<IRos2Topic[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const alert = useAlert()

    useEffect(() => {
        setRows(topics.map(e => ({ ...e, id: e._id, type: e.messageType._id })))
    }, [topics])

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCreateTypeClick = async (data: IRos2Message) => {
        if (messageTypes.includes(data)) {
            alert.warn("The message already exist...")
        }

        try {
            const id = await ros2Api.createMessageType(robotId, partId, {
                message: {
                    name: data.name,
                    fields: data.fields
                }
            })
            data._id = id
            setMessageTypes([...messageTypes, data])
        }
        catch {
            alert.error("An error has occured while creating a message type")
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
            await ros2Api.deleteTopic(robotId, partId, id as string)
            setTopics(topics.filter(e => e._id !== id))
        }
        catch {
            alert.error("An error has occured while deleting a type")
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
        const messageType = messageTypes.find(e => e._id === updatedRow.type) as IMessageType
        if (newRow.isNew) {
            try {
                const topicId = await ros2Api.createTopic(robotId, partId, {
                    name: updatedRow.name,
                    messageTypeId: updatedRow.type
                })
                const topic: IRos2Topic = {
                    _id: topicId,
                    name: updatedRow.name,
                    messageType

                }
                setTopics([...topics, topic])
            }
            catch {
                alert.error("Failed to create a topic")
                return
            }
        }
        else {
            try {
                await ros2Api.updateSchemaType(robotId, 'topic', {
                    topic: {
                        _id: updatedRow.id,
                        messageType: {
                            _id: updatedRow.type,
                        },
                        name: updatedRow.name,
                    }
                } as any)
                const updatedTopic: IRos2Topic = {
                    _id: updatedRow.id as string,
                    name: updatedRow.name as string,
                    messageType
                }
                setTopics(topics.map(e => e._id === updatedTopic._id ? updatedTopic : e))
            }
            catch {
                alert.error("Failed to update a topic")
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
                <RenderTypeEdit {...params} messageTypes={messageTypes} />
            ),
            renderCell: (params: GridRenderCellParams) => (
                <RenderType {...params} messageTypes={messageTypes} />
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
                        handleCreateTypeClick,
                        messageTypesLength: messageTypes.length
                    },
                }}
            />
        </Box>
    );
};

interface EditToolbarProps {
    messageTypesLength: number
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    handleCreateTypeClick: (data: IRos2Message) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { messageTypesLength, setRows, setRowModesModel, handleCreateTypeClick } = props;

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
            <Button color="primary" disabled={messageTypesLength === 0} startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
            <ButtonDialog
                onConfirm={(data) => handleCreateTypeClick(data)}
                dialog={AddMessageTypeDialog}
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

export default TopicTable