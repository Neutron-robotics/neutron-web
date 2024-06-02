import { Autocomplete, Box, Button, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
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
import { SyntheticEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import * as ros2Api from '../../../api/ros2'
import { useAlert } from "../../../contexts/AlertContext";
import useCachedState from "../../../utils/useCachedState";
import { IRos2Service, IRos2ServiceMessage } from "@neutron-robotics/neutron-core";
import ButtonDialog from "../../controls/ButtonDialog";
import AddServiceTypeDialog from "./AddServiceTypeDialog";
import { getFirstPartBeforeSeparatorOrDefault, getLastPartAfterSeparator } from "../../../utils/string";

interface IServiceTableProps {
    robotId: string
    partId: string
}

interface RenderTypeEditProps extends GridRenderCellParams<any, string> {
    serviceTypes: IRos2ServiceMessage[]
}

const RenderTypeEdit = (props: RenderTypeEditProps) => {
    const { id, field, serviceTypes, row } = props;
    const apiRef = useGridApiContext();
    const [inputValue, setInputValue] = useState('');

    // useEffect(() => {
    //     apiRef.current.setEditCellValue({ id, field, value: serviceTypes.length ? row.serviceTypeId ?? serviceTypes[0]?._id : '' });
    // }, [])

    const serviceTypesSorted = serviceTypes.sort((a, b) => {
        if (a.name.includes('/') && !b.name.includes('/')) {
            return 1; // Place 'b' before 'a'
        } else if (!a.name.includes('/') && b.name.includes('/')) {
            return -1; // Place 'a' before 'b'
        }

        return a.name.localeCompare(b.name);
    });

    function handleSelectChange(event: SelectChangeEvent<string>): void {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    }

    function handleChangeEvent(event: SyntheticEvent<Element, Event>, value: IRos2ServiceMessage | null): void {
        if (value === null)
            return

        apiRef.current.setEditCellValue({ id, field, value });
    }

    return (
        <Autocomplete
            options={serviceTypesSorted}
            groupBy={(option) => getFirstPartBeforeSeparatorOrDefault(option.name, '/', "Unknown Package")}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(opt, value) => opt._id === value._id}
            fullWidth
            value={row.type}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            onChange={handleChangeEvent}
            renderInput={(params) => <TextField {...params} />}
        />
    )
};

const RenderType = (props: GridRenderCellParams<any, IRos2ServiceMessage | undefined>) => {
    const { value } = props;
    const serviceName = value?.name ?? ''

    return (
        <div>
            {getLastPartAfterSeparator(serviceName, '/')}
        </div>
    )
}

const ServiceTable = (props: IServiceTableProps) => {
    const { robotId, partId } = props
    const [serviceTypes, setServiceType] = useCachedState<IRos2ServiceMessage[]>(`serviceTypes-${robotId}-${partId}`, [])
    const [standardServiceTypes, setStandardServiceTypes] = useCachedState<IRos2ServiceMessage[]>(`serviceType-standard`, [])
    const [services, setServices] = useCachedState<IRos2Service[]>(`services-${robotId}-${partId}`, [])
    const [rows, setRows] = useState<IRos2Service[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const alert = useAlert()

    const allServiceTypes = [...serviceTypes, ...standardServiceTypes].reduce<IRos2ServiceMessage[]>((acc, cur) => {
        if (acc.find(e => e._id === cur._id))
            return acc
        return [...acc, cur]
    }, [])

    useEffect(() => {
        setRows(services.map(e => ({ ...e, id: e._id, serviceTypeId: e.serviceType })))
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
        if (allServiceTypes.includes(data)) {
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
        const serviceType = allServiceTypes.find(e => e._id === updatedRow.serviceType._id) as IRos2ServiceMessage
        if (newRow.isNew) {
            try {
                const serviceId = await ros2Api.createService(robotId, partId, {
                    name: updatedRow.name,
                    serviceTypeId: updatedRow.serviceType._id,
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
                            _id: updatedRow.serviceType._id,
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
            field: "serviceType",
            headerName: "Service type",
            width: 150,
            flex: 1,
            editable: true,
            renderEditCell: (params: GridRenderEditCellParams) => (
                <RenderTypeEdit {...params} serviceTypes={allServiceTypes} />
            ),
            renderCell: (params: GridRenderCellParams) => (
                <RenderType {...params} />
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
                        handleCreateServiceTypeClick,
                    },
                }}
            />
        </Box>
    );
};

interface EditToolbarProps {
    serviceTypesLength: number;
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
        setRows((oldRows) => [...oldRows, { id, isNew: true }]);
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