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
import { IRos2Service, IRos2ServiceMessage } from "neutron-core";
import ButtonDialog from "../../controls/ButtonDialog";
import AddServiceTypeDialog from "./AddServiceTypeDialog";

interface IServiceTableProps {
    robotId: string
    partId: string
}

interface RenderTypeEditProps extends GridRenderCellParams<any, string> {
    serviceTypes: IRos2ServiceMessage[]
}

interface RenderTypeProps extends GridRenderCellParams<any, string> {
    serviceTypes: IRos2ServiceMessage[]
}

const RenderTypeEdit = (props: RenderTypeEditProps) => {
    const { id, field, serviceTypes, row } = props;
    const apiRef = useGridApiContext();

    useEffect(() => {
        apiRef.current.setEditCellValue({ id, field, value: serviceTypes.length ? row.serviceTypeId ?? serviceTypes[0]._id : '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }

    return (
        <Select onChange={handleSelectChange} defaultValue={serviceTypes.length ? row.serviceTypeId ?? serviceTypes[0]._id : ''} value={row.serviceTypeId ?? serviceTypes[0]._id} fullWidth>
            {serviceTypes.map((e) => (
                <MenuItem key={e._id} value={e._id}>
                    {e.name}
                </MenuItem>
            ))}
        </Select>
    );
};

const RenderType = (props: RenderTypeProps) => {
    const { serviceTypes, row } = props;

    return (
        <div>
            {serviceTypes.find(e => e._id === row.serviceTypeId)?.name ?? 'Unknown'}
        </div>
    )
}

const ServiceTable = (props: IServiceTableProps) => {
    const { robotId, partId } = props
    const [serviceTypes, setServiceType] = useCachedState<IRos2ServiceMessage[]>(`serviceTypes-${robotId}-${partId}`, [])
    const [services, setServices] = useCachedState<IRos2Service[]>(`services-${robotId}-${partId}`, [])
    const [rows, setRows] = useState<IRos2Service[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const alert = useAlert()

    useEffect(() => {
        setRows(services.map(e => ({ ...e, id: e._id, serviceTypeId: e.serviceType._id })))
    }, [services])

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleCreateServiceTypeClick = async (data: IRos2ServiceMessage) => {
        if (serviceTypes.includes(data)) {
            alert.warn("The service type already exist...")
        }

        try {
            const id = await ros2Api.createMessageType(robotId, partId, {
                service: {
                    name: data.name,
                    request: data.request,
                    response: data.response,
                }
            })
            data._id = id
            setServiceType([...serviceTypes, data])
        }
        catch {
            alert.error("An error has occured while creating a service type")
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
            setServices(services.filter(e => e._id !== id))
        }
        catch {
            alert.error("An error has occured while deleting a service")
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
        const serviceType = serviceTypes.find(e => e._id === updatedRow.serviceTypeId) as IRos2ServiceMessage
        if (newRow.isNew) {
            try {
                const serviceId = await ros2Api.createService(robotId, partId, {
                    name: updatedRow.name,
                    serviceTypeId: updatedRow.serviceTypeId,
                })
                const service: IRos2Service = {
                    _id: serviceId,
                    name: updatedRow.name,
                    serviceType
                }
                setServices([...services, service])
            }
            catch {
                alert.error("Failed to create a service")
                return
            }
        }
        else {
            try {
                await ros2Api.updateSchemaType(robotId, 'service', {
                    service: {
                        _id: updatedRow.id,
                        name: updatedRow.name,
                        serviceType: {
                            _id: updatedRow.serviceTypeId,
                        },
                    }
                } as any)
                const updatedService: IRos2Service = {
                    _id: updatedRow.id as string,
                    name: updatedRow.name as string,
                    serviceType
                }
                setServices(services.map(e => e._id === updatedService._id ? updatedService : e))
            }
            catch {
                alert.error("Failed to update a service")
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
            headerName: "Service Name",
            width: 150,
            editable: true,
            flex: 1,
        },
        {
            field: "serviceTypeId",
            headerName: "Action type",
            width: 150,
            flex: 1,
            editable: true,
            renderEditCell: (params: GridRenderEditCellParams) => (
                <RenderTypeEdit {...params} serviceTypes={serviceTypes} />
            ),
            renderCell: (params: GridRenderCellParams) => (
                <RenderType {...params} serviceTypes={serviceTypes} />
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
                        handleCreateServiceTypeClick
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
    handleCreateServiceTypeClick: (data: IRos2ServiceMessage) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, handleCreateServiceTypeClick } = props;

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
                onConfirm={(data) => handleCreateServiceTypeClick(data)}
                dialog={AddServiceTypeDialog}
                dialogProps={{
                    title: "New Service Type",
                }}
            >
                <Button color="primary" startIcon={<AddIcon />}>
                    Add Type
                </Button>
            </ButtonDialog>
        </GridToolbarContainer>
    );
}

export default ServiceTable