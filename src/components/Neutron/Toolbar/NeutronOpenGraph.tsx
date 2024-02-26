import { makeStyles } from "@mui/styles"
import { INeutronGraph, INeutronGraphWithOrganization, INeutronGraphWithRobots } from "../../../api/models/graph.model"
import { InputAdornment, Tab, Tabs, TextField, Typography } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import * as graphApi from "../../../api/graph"
import NeutronGraphCard from "./NeutronGraphCard";
import moment from "moment";
import { useAuth } from "../../../contexts/AuthContext";

const useStyles = makeStyles(() => ({
    root: {
    },
    topBar: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        marginRight: 'auto'
    },
    searchBar: {
        marginLeft: 'auto !important',
        marginRight: 'auto !important',
        width: '50% !important',
    },
    graphCategory: {
        display: 'flex',
        justifyContent: 'space-evenly',
        gap: '20px',
        flexWrap: 'wrap'
    },
    graphCategoryTitle: {
        paddingBottom: '15px',
        paddingTop: '15px'
    }
}))

interface NeutronOpenGraphProps {
    onGraphSelected: (graph: INeutronGraph) => void
}

type INeutronGraphOpen = INeutronGraphWithOrganization & INeutronGraphWithRobots

const NeutronOpenGraph = (props: NeutronOpenGraphProps) => {
    const { onGraphSelected } = props
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)
    const [graphDisposition, setGraphDisposition] = useState<Record<string, INeutronGraphOpen[]>>()
    const [allGraphs, setAllGraphs] = useState<INeutronGraphOpen[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const { user } = useAuth();

    useEffect(() => {
        graphApi.getAllWith(true, true).then((res) => {
            setAllGraphs(res)
            filterByTime(res)
        })
    }, [])

    const filterByTime = useCallback((allGraphs: INeutronGraphOpen[]) => {
        const filteredGraphs = allGraphs.filter(e => e.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))

        const disposition: Record<string, INeutronGraphOpen[]> = {
            'Today': filteredGraphs.filter(e => moment(e.updatedAt).isSame(moment(), 'day')),
            'This month': filteredGraphs.filter(e => moment(e.updatedAt).isSame(moment(), 'month') && !moment(e.updatedAt).isSame(moment(), 'day')),
            'Olders': filteredGraphs.filter(e => !moment(e.updatedAt).isSame(moment(), 'month') && !moment(e.updatedAt).isSame(moment(), 'day'))
        }
        for (const key in disposition) {
            if (Array.isArray(disposition[key]) && disposition[key].length === 0) {
                delete disposition[key];
            }
        }
        setGraphDisposition(disposition)
    }, [searchQuery])

    const filterByRobots = useCallback((allGraphs: INeutronGraphOpen[]) => {
        const filteredGraphs = allGraphs.filter(e => e.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
        const disposition = filteredGraphs.reduce<Record<string, INeutronGraphOpen[]>>((acc, cur) => {
            if (acc[cur.robot.name]) {
                return {
                    ...acc,
                    [cur.robot.name]: [...acc[cur.robot.name], cur]
                }
            }
            else {
                return {
                    ...acc,
                    [cur.robot.name]: [cur]
                }
            }
        }, {})
        setGraphDisposition(disposition)
    }, [searchQuery])

    const filterByOrganization = useCallback((allGraphs: INeutronGraphOpen[]) => {
        const filteredGraphs = allGraphs.filter(e => e.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
        const disposition = filteredGraphs.reduce<Record<string, INeutronGraphOpen[]>>((acc, cur) => {
            if (acc[cur.organization.name]) {
                return {
                    ...acc,
                    [cur.organization.name]: [...acc[cur.organization.name], cur]
                }
            }
            else {
                return {
                    ...acc,
                    [cur.organization.name]: [cur]
                }
            }
        }, {})
        setGraphDisposition(disposition)

    }, [searchQuery])

    const filterByOwnership = useCallback((allGraphs: INeutronGraphOpen[]) => {
        const filteredGraphs = allGraphs.filter(e => e.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())).sort((a, b) => moment(b.updatedAt).diff(moment(a.updatedAt)))

        const disposition: Record<string, INeutronGraphOpen[]> = {
            'My graphs': filteredGraphs.filter(e => e.createdBy === user?.id),
            'Modified by me': filteredGraphs.filter(e => e.modifiedBy === user?.id)
        }
        for (const key in disposition) {
            if (Array.isArray(disposition[key]) && disposition[key].length === 0) {
                delete disposition[key];
            }
        }
        setGraphDisposition(disposition)
    }, [allGraphs, searchQuery])


    const onTabChange = useCallback((value: number) => {
        setActiveTab(value)
        switch (value) {
            case 0:
                filterByTime(allGraphs)
                break
            case 1:
                filterByRobots(allGraphs)
                break;
            case 2:
                filterByOrganization(allGraphs)
                break;
            case 3:
                filterByOwnership(allGraphs)
                break;
            default:
                break
        }
    }, [allGraphs, filterByOrganization, filterByOwnership, filterByRobots, filterByTime])

    useEffect(() => {
        onTabChange(activeTab)
    }, [activeTab, onTabChange, searchQuery])

    function handleSearchChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setSearchQuery(event.target.value)
    }

    return (
        <div className={classes.root}>
            <div className={classes.topBar}>
                <h3 className={classes.title}>Open a Neutron Graph</h3>
                <TextField
                    className={classes.searchBar}
                    onChange={handleSearchChange}
                    placeholder="Search by title"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <Tabs
                centered
                value={activeTab}
                onChange={(_, v) => onTabChange(v)}
                aria-label="tabs"
            >
                <Tab label="Latests" />
                <Tab label="Robots" />
                <Tab label="Organization" />
                <Tab label="Mines" />
            </Tabs>
            <div>
                {graphDisposition ? Object.entries(graphDisposition).map(([key, graphs]) => (
                    <div key={key}>
                        <div className={classes.graphCategoryTitle}>{key}</div>
                        <div className={classes.graphCategory}>
                            {graphs.map(graph => <NeutronGraphCard key={graph._id} graph={graph} onCardClick={onGraphSelected} />)}
                        </div>
                    </div>
                )) : ''}
            </div>
        </div>
    )
}

export default NeutronOpenGraph