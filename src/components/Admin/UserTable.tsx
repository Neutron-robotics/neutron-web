import { Box, Button, InputAdornment, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
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
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useAlert } from "../../contexts/AlertContext";
import ButtonDialog from "../controls/ButtonDialog";
import { UserModel } from "../../api/models/user.model";
import { makeStyles } from "@mui/styles";
import SearchIcon from '@mui/icons-material/Search';
import AddUserDialog from "./AddUserDialog";
import * as adminApi from '../../api/admin'


const useStyles = makeStyles(() => ({
    roleInput: {
        fontSize: "14px !important"
    }
}))


const RenderRoleEdit = (props: GridRenderCellParams<any, string>) => {
    const { id, field, row } = props;
    const apiRef = useGridApiContext();
    const classes = useStyles()

    function handleRoleUpdate(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        const role = event.target.value
        apiRef.current.setEditCellValue({ id, field, value: role });
    }

    return (
        <TextField
            defaultValue={row.role}
            onChange={handleRoleUpdate}
            fullWidth
            InputProps={{
                className: classes.roleInput,
            }}
            variant="outlined"
        />
    );
};


interface UserTableProps {
}

const UserTable = (props: UserTableProps) => {
    const [rows, setRows] = useState<UserModel[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [searchValue, setSearchValue] = useState('')

    const alert = useAlert()

    useEffect(() => {
        adminApi.getUsers()
            .then((users) => setRows(users))
            .catch(err => alert.error(err.message))
    }, [])

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleSearchValueChanged = (value: string) => {
        setSearchValue(value)
    }

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            await adminApi.deleteUser(id.toString())
            setRows(prev => prev.map(e => e.id === id ? ({ ...e, active: false }) : e))
            alert.success("User has been successfuly disabled")
        }
        catch {
            alert.error("An error has occured while deleting a user")
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
        if (newRow.isNew) {
            return
        }
        else {
            try {
                const updateSchema = {
                    email: newRow.email,
                    firstName: newRow.firstName,
                    lastName: newRow.lastName,
                    active: newRow.active,
                    role: newRow.role,
                }
                await adminApi.updateUser(newRow.id, updateSchema)
                setRows(rows.map(e => e.id === newRow.id ? newRow as UserModel : e))
            }
            catch {
                alert.error("Failed to update the user")
            }
        }
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: "email",
            headerName: "Email",
            width: 150,
            editable: true,
            flex: 1,
        },
        {
            field: "firstName",
            headerName: "First Name",
            width: 150,
            flex: 1,
            editable: true,
        },
        {
            field: "lastName",
            headerName: "Last Name",
            width: 150,
            flex: 1,
            editable: true,
        },
        {
            field: "active",
            headerName: "Active",
            width: 150,
            flex: 1,
            editable: true,
        },
        {
            field: "role",
            headerName: "Role",
            width: 150,
            flex: 1,
            editable: true,
            renderEditCell: (params: GridRenderEditCellParams) => (
                <RenderRoleEdit {...params} />
            ),
            renderCell: (params: GridRenderCellParams) =>
            (
                <div>{(params as any).row.role}</div>
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
                height: '80%',
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <DataGrid
                rows={rows.filter(e => `${e.email}-${e.firstName}-${e.lastName}`.includes(searchValue))}
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
                        handleSearchValueChanged,
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
    handleSearchValueChanged: (value: string) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, handleSearchValueChanged } = props;
    const alert = useAlert()

    const handleClick = () => {
        const id = v4();
        setRows((oldRows) => [...oldRows, { id, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }));
    };

    function handleOnSearchUserChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        handleSearchValueChanged(event.target.value)
    }

    function handleInviteUser(email: any): void {
        adminApi.inviteUser(email)
        alert.success(`An invitation has been sent to ${email}`)
    }

    return (
        <GridToolbarContainer
            sx={{ display: "flex !important", justifyContent: "space-between" }}
        >
            <TextField
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                onChange={handleOnSearchUserChanged}
                placeholder="Search a user"
            />
            <ButtonDialog
                onConfirm={(data) => handleInviteUser(data)}
                dialog={AddUserDialog}
                dialogProps={{
                    title: "Invite User",
                }}
            >
                <Button color="primary" startIcon={<AddIcon />}>
                    Invite User
                </Button>
            </ButtonDialog>
        </GridToolbarContainer>
    );
}

export default UserTable