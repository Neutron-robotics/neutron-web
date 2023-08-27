import { useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import { OrganizationModel } from "../api/models/organization.model";
import { useAlert } from "../contexts/AlertContext";
import * as organization from "../api/organization";
import OrganizationView from "./OrganizationView";
import RobotView from "./RobotView";
import { IRobot, IRobotPart } from "../api/models/robot.model";
import RobotPartView from "./RobotPartView";
import * as ros2Api from '../api/ros2'
import { IRos2System } from "../utils/ros2";

interface OrganizationPageProps {
    user: UserModel
}

export enum OrganizationViewType {
    Summary,
    Robot,
    Part
}

const OrganizationPage = (props: OrganizationPageProps) => {
    const { user } = props
    const [organizations, setOrganizations] = useState<OrganizationModel[]>([])
    const [robot, setRobot] = useState<IRobot | null>(null)
    const [part, setPart] = useState<IRobotPart | null>(null)
    const [ros2System, setRos2System] = useState<IRos2System | null>(null)
    const [organizationActiveTab, setOrganizationActiveTab] = useState(0)
    const [activeOrganizationIndex, setActiveOrganizationIndex] = useState(0)
    const [viewItem, setViewItem] = useState<OrganizationViewType>(
        OrganizationViewType.Summary
    )
    const alert = useAlert();



    useEffect(() => {
        organization
            .me()
            .then((organizations) => {
                setOrganizations(organizations);
            })
            .catch(() => {
                console.log("failed to fetch organizations");
            });
    }, [alert])

    const handleOrganizationChange = (organizationName: string) => {
        const index = organizations.findIndex(e => e.name === organizationName)
        if (index === -1)
            return
        setActiveOrganizationIndex(index)
    }

    const handleUpdateOrganization = (updateModel: Partial<OrganizationModel>) => {
        setOrganizations((prev) => {
            const updatedOrganizations = prev.map((org, index) =>
                index === activeOrganizationIndex
                    ? { ...org, ...updateModel }
                    : org
            );
            return updatedOrganizations;
        });
    }

    const handlePartUpdate = (part: IRobotPart) => {
        if (robot === null)
            return

        const rbt = {
            ...robot,
            parts:
                [
                    ...robot.parts.filter(p => p._id !== part._id),
                    part,
                ]
        }
        setRobot(rbt)
    }

    switch (viewItem) {
        case OrganizationViewType.Summary:
            return (
                <>
                    {organizations[activeOrganizationIndex] && (
                        <OrganizationView
                            user={user}
                            organizations={organizations}
                            activeOrganization={organizations[activeOrganizationIndex]}
                            activeTab={organizationActiveTab}
                            onTabChange={(t) => setOrganizationActiveTab(t)}
                            onOrganizationSwitch={handleOrganizationChange}
                            onUpdateOrganization={handleUpdateOrganization}
                            onSelectRobot={(robot: IRobot | null) => {
                                if (robot)
                                    ros2Api.getRos2System(robot._id)
                                        .then((ros2SystemModel) => {
                                            console.log("system", ros2SystemModel)
                                            setRos2System(ros2SystemModel)
                                        })
                                        .catch(() => {
                                            alert.warn("An error has occured while fetching Ros2System")
                                        })
                                else
                                    setRos2System(null)
                                setRobot(robot)
                                setViewItem(OrganizationViewType.Robot)
                            }}
                        />
                    )}
                </>
            )
        case OrganizationViewType.Robot:
            return (
                <>
                    <RobotView
                        user={user}
                        activeOrganization={organizations[activeOrganizationIndex]}
                        title={robot?.name ?? "Create Robot"}
                        robotModel={robot}
                        onBreadcrumbsClick={() => {
                            setRobot(null)
                            setViewItem(OrganizationViewType.Summary)
                        }}
                        onSelectPart={(part: IRobotPart | null) => {
                            setPart(part)
                            setViewItem(OrganizationViewType.Part)
                        }}
                    />
                </>
            )
        case OrganizationViewType.Part:
            return (
                <RobotPartView
                    title={part?.name ?? "New Part"}
                    activeOrganization={organizations[activeOrganizationIndex]}
                    robotModel={robot as IRobot}
                    partModel={part}
                    onPartUpdate={handlePartUpdate}
                    onBreadcrumbsClick={(view: OrganizationViewType) => {
                        setPart(null)
                        setViewItem(view)
                    }}
                    ros2System={ros2System}
                />
            )
        default:
            return <>no organizations</>
    }
}

export default OrganizationPage