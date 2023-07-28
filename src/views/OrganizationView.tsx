import { useEffect, useState } from "react"
import { UserModel } from "../api/models/user.model"
import * as auth from "../api/auth"
import * as organization from "../api/organization"
import { OrganizationModel } from "../api/models/organization.model"
import { MenuItem, Select, SelectChangeEvent, Tab, Tabs } from "@mui/material"
import { makeStyles } from "@mui/styles"
import OrganizationMemberTable from "../components/Organization/OrganizationMemberTable"

const useStyles = makeStyles(() => ({
    root: {
        padding: '30px'
    },
    organizationSlider: {
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex !important',
        maxWidth: '300px',
    },
    organizationInfos: {
        display: 'flex',
        "& img": {
            maxWidth: '150px',
            marginRight: '40px',
            objectFit: 'cover',
            height: '100%'
        },
        "& p": {
            backgroundColor: "#aaaaaa",
            borderRadius: "40px",
            padding: "20px"
        }
    },
}))

const OrganizationView = () => {
    const [user, setUser] = useState<UserModel>()
    const [organizations, setOrganizations] = useState<OrganizationModel[]>([])
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationModel>()
    const [activeTab, setActiveTab] = useState(0)
    const classes = useStyles()

    useEffect(() => {
        auth.me().then(user => {
            setUser(user)
        }).catch(() => {
            console.log("failed to fetch user")
        })
        organization.me().then((organizations) => {
            setOrganizations(organizations)
            if (organizations.length > 0)
                setSelectedOrganization(organizations[0])
        }).catch(() => {
            console.log("failed to fetch organizations")
        })
    }, [])

    const handleOrganizationChange = (event: SelectChangeEvent<string>) => {
        const organization = organizations.find(e => e.name === event.target.value)
        setSelectedOrganization(organization)
    }

    return (
        <>
            {selectedOrganization !== undefined && (
                <div className={classes.root}>
                    <Select
                        className={classes.organizationSlider}
                        value={selectedOrganization.name}
                        label="Organization"
                        onChange={handleOrganizationChange}
                    >
                        {organizations?.map(e => (
                            <MenuItem key={e.name} value={e.name}>{e.name}</MenuItem>
                        ))}
                    </Select >
                    <div className={classes.organizationInfos}>
                        <img src={`${process.env.REACT_APP_API_URL}${selectedOrganization.imgUrl}`} alt={"company-icon"} />
                        <p>{selectedOrganization.description}</p>
                    </div>
                    <Tabs centered value={activeTab} onChange={(_, v) => setActiveTab(v)} aria-label="tabs">
                        <Tab label="Member" />
                        <Tab label="Robots" />
                        <Tab label="Activity" />
                        <Tab label="Missions" />
                    </Tabs>
                    {user && activeTab === 0 && (
                        <OrganizationMemberTable me={user} organizationModel={selectedOrganization} />
                    )}
                </div>
            )}
        </>
    )
}

export default OrganizationView