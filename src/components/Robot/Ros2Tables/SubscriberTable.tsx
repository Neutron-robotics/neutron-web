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
import { IRos2Subscriber, IRos2Topic } from "neutron-core";

interface ISubscriberTableProps {
    robotId: string
    partId: string
}

interface RenderTypeEditProps extends GridRenderCellParams<any, string> {
    topics: IRos2Topic[]
}

interface RenderTypeProps extends GridRenderCellParams<any, string> {
    topics: IRos2Topic[]
}

const RenderTypeEdit = (props: RenderTypeEditProps) => {
    const { id, field, topics, row } = props;
    const apiRef = useGridApiContext();

    useEffect(() => {
        apiRef.current.setEditCellValue({ id, field, value: topics.length ? row.topicId ?? topics[0]._id : '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }

    return (
        <Select onChange={handleSelectChange} defaultValue={topics.length ? row.topicId ?? topics[0]._id : ''} value={row.topicId ?? topics[0]._id} fullWidth>
            {topics.map((e) => (
                <MenuItem key={e._id} value={e._id}>
                    {e.name}
                </MenuItem>
            ))}
        </Select>
    );
};

const RenderType = (props: RenderTypeProps) => {
    const { topics, row } = props;

    return (
        <div>
            {topics.find(e => e._id === row.topicId)?.name ?? 'Unknown'}
        </div>
    )
}

const SubscriberTable = (props: ISubscriberTableProps) => {
    const { robotId, partId } = props
    const [topics] = useCachedState<IRos2Topic[]>(`topics-${robotId}-${partId}`, [])
    const [subscribers, setSubscribers] = useCachedState<IRos2Subscriber[]>(`subscribers-${robotId}-${partId}`, [])
    const [rows, setRows] = useState<IRos2Subscriber[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const alert = useAlert()

    useEffect(() => {
        setRows(subscribers.map(e => ({ ...e, id: e._id, topicId: e.topic._id })))
    }, [subscribers])

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
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
            await ros2Api.deleteSubscriber(robotId, partId, id as string)
            setSubscribers(subscribers.filter(e => e._id !== id))
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
        const topic = topics.find(e => e._id === updatedRow.topicId) as IRos2Topic
        if (newRow.isNew) {
            try {
                const subscriberId = await ros2Api.createSubscriber(robotId, partId, {
                    name: updatedRow.name,
                    topicId: updatedRow.topicId,
                })
                const subscriber: IRos2Subscriber = {
                    _id: subscriberId,
                    name: updatedRow.name,
                    topic
                }
                setSubscribers([...subscribers, subscriber])
            }
            catch {
                alert.error("Failed to create a subscriber")
                return
            }
        }
        else {
            try {
                await ros2Api.updateSchemaType(robotId, 'subscriber', {
                    subscriber: {
                        _id: updatedRow.id,
                        name: updatedRow.name,
                        topic: {
                            _id: updatedRow.topicId,
                        },
                    }
                } as any)
                const updatedSubscriber: IRos2Subscriber = {
                    _id: updatedRow.id as string,
                    name: updatedRow.name as string,
                    topic
                }
                setSubscribers(subscribers.map(e => e._id === updatedSubscriber._id ? updatedSubscriber : e))
            }
            catch {
                alert.error("Failed to update a subscriber")
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
            headerName: "Subscriber Name",
            width: 150,
            editable: true,
            flex: 1,
        },
        {
            field: "topicId",
            headerName: "Topic",
            width: 150,
            flex: 1,
            editable: true,
            renderEditCell: (params: GridRenderEditCellParams) => (
                <RenderTypeEdit {...params} topics={topics} />
            ),
            renderCell: (params: GridRenderCellParams) => (
                <RenderType {...params} topics={topics} />
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
                        topicLength: topics.length,
                        setRows,
                        setRowModesModel,
                    },
                }}
            />
        </Box>
    );
};

interface EditToolbarProps {
    topicLength: number
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { topicLength, setRows, setRowModesModel } = props;

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
            <Button disabled={topicLength === 0} color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

export default SubscriberTable