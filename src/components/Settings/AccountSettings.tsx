import { Button, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ClickableImageUpload from "../controls/imageUpload"
import { useAuth } from "../../contexts/AuthContext"
import { userIconOrGenerated } from "../../utils/thumbnail"
import { useEffect, useState } from "react"
import { UserModel } from "../../api/models/user.model"
import * as authApi from "../../api/auth"
import { useAlert } from "../../contexts/AlertContext"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { InputButton } from "../controls/InputButton"
import { uploadFile } from "../../api/file"

const useStyles = makeStyles(() => ({
    settings: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    textfield: {},
    userthumbnail: {
        "& img": {
            maxWidth: "150px",
            marginRight: "40px",
            objectFit: "cover",
            height: "100%",
        },
    },
    formColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formRow: {
        display: 'flex',
        gap: '20px'
    },
    userSettings: {
        display: 'flex',
        justifyContent: 'space-around'
    }
}))

interface AccountSettingsProps {
}

const AccountSettings = (props: AccountSettingsProps) => {
    const { } = props
    const classes = useStyles()
    const { user, refresh } = useAuth()
    const [userModel, setUserModel] = useState<UserModel>()
    const alert = useAlert()

    const isUserChanged = user !== userModel

    useEffect(() => {
        if (!user)
            return

        setUserModel(user)
    }, [user])

    async function handleUserThumbnailChanged(file: File): Promise<void> {
        if (!userModel)
            return

        try {
            const imgUrl = await uploadFile(file)
            setUserModel(({ ...userModel, imgUrl }))
        }
        catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    }

    async function handleSaveClick() {
        if (!userModel)
            return

        try {
            const updatedUserPayload: Partial<UserModel> = {
                firstName: userModel.firstName,
                lastName: userModel.lastName,
                imgUrl: userModel.imgUrl
            }
            await authApi.update(updatedUserPayload)
            refresh()

        }
        catch (err: any) {
            alert.error("Failed to update user informations")
        }
    }

    if (!userModel)
        return <div></div>

    return (
        <div className={classes.settings}>
            <h3>My Profile</h3>
            <div className={classes.userSettings}>
                <div className={classes.userthumbnail}>
                    <ClickableImageUpload
                        src={userIconOrGenerated(userModel)}
                        alt={'user-thumbnail'}
                        onImageClick={handleUserThumbnailChanged}
                    />
                </div>
                <div className={classes.formColumn}>
                    <div className={classes.formRow}>
                        <TextField
                            className={classes.textfield}
                            onChange={e => setUserModel(({ ...userModel, firstName: e.target.value }))}
                            label="First Name"
                            fullWidth
                            value={userModel.firstName}
                        />
                        <TextField
                            className={classes.textfield}
                            onChange={e => setUserModel(({ ...userModel, lastName: e.target.value }))}
                            label="Last Name"
                            value={userModel.lastName}
                            fullWidth
                        />
                    </div>
                    <TextField
                        className={classes.textfield}
                        label="Kibana username"
                        value={userModel.elasticUsername}
                        fullWidth
                        disabled
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <InputButton opacity={0}>
                                        <Tooltip title="Use this username to log in to the Kibana visualization interface. The password is identical to your current account's password.">
                                            <HelpOutlineIcon />
                                        </Tooltip>
                                    </InputButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className={classes.textfield}
                        onChange={e => setUserModel(({ ...userModel, email: e.target.value }))}
                        value={userModel.email}
                        disabled
                        label="Email"
                        fullWidth
                    />
                    <TextField
                        className={classes.textfield}
                        disabled
                        value="******"
                        type='password'
                        label="Password"
                        fullWidth
                    />
                    <Button variant="contained" disabled={!isUserChanged} onClick={handleSaveClick}>Update</Button>
                </div>
            </div>
        </div >
    )
}

export default AccountSettings