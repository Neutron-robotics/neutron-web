import { useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import useStack from "../components/controls/useStack";
import { OrganizationModel } from "../api/models/organization.model";
import { useAlert } from "../contexts/AlertContext";
import * as organization from "../api/organization";
import OrganizationView from "./OrganizationView";
import RobotView from "./RobotView";
import { IRobot, IRobotPart } from "../api/models/robot.model";
import RobotPartView from "./RobotPartView";

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
        console.log("PART UPDATE")
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
        console.log('rbt', rbt)
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
                />
            )
        default:
            return <>no organizations</>
    }
}

export default OrganizationPage