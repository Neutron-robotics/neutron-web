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
import { IRos2Publisher, IRos2Topic } from "@neutron-robotics/neutron-core";

interface IPublisherTableProps {
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
        apiRef.current.setEditCellValue({ id, field, value: topics.length ? row.topicId ?? topics[0]?._id : '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }

    return (
        <Select onChange={handleSelectChange} defaultValue={topics.length ? row.topicId ?? topics[0]?._id : ''} value={row.topicId ?? topics[0]?._id} fullWidth>
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

const PublisherTable = (props: IPublisherTableProps) => {
    const { robotId, partId } = props
    const [topics] = useCachedState<IRos2Topic[]>(`topics-${robotId}-${partId}`, [])
    const [publishers, setPublishers] = useCachedState<IRos2Publisher[]>(`publishers-${robotId}-${partId}`, [])
    const [rows, setRows] = useState<IRos2Publisher[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const alert = useAlert()

    useEffect(() => {
        setRows(publishers.map(e => ({ ...e, id: e._id, topicId: e.topic._id })))
    }, [publishers])

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
            await ros2Api.deletePublisher(robotId, partId, id as string)
            setPublishers(publishers.filter(e => e._id !== id))
        }
        catch {
            alert.error("An error has occured while deleting a publisher")
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
                const publisherId = await ros2Api.createPublisher(robotId, partId, {
                    name: updatedRow.name,
                    topicId: updatedRow.topicId,
                    frequency: updatedRow.frequency
                })
                const publisher: IRos2Publisher = {
                    _id: publisherId,
                    name: updatedRow.name,
                    frequency: updatedRow.frequency,
                    topic
                }
                setPublishers([...publishers, publisher])
            }
            catch {
                alert.error("Failed to create a publisher")
                return
            }
        }
        else {
            try {
                await ros2Api.updateSchemaType(robotId, 'publisher', {
                    publisher: {
                        _id: updatedRow.id,
                        name: updatedRow.name,
                        frequency: updatedRow.frequency,
                        topic: {
                            _id: updatedRow.topicId,
                        },
                    }
                } as any)
                const updatedPublisher: IRos2Publisher = {
                    _id: updatedRow.id as string,
                    name: updatedRow.name as string,
                    frequency: updatedRow.frequency,
                    topic
                }
                setPublishers(publishers.map(e => e._id === updatedPublisher._id ? updatedPublisher : e))
            }
            catch {
                alert.error("Failed to update a publisher")
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
            headerName: "Publisher Name",
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
            field: "frequency",
            headerName: "Frequency",
            editable: true,
            type: 'number',
            flex: 1,
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
                        topicLength: topics.length
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

export default PublisherTable