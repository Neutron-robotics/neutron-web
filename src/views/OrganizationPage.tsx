import { useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import useStack from "../components/controls/useStack";
import { OrganizationModel } from "../api/models/organization.model";
import { useAlert } from "../contexts/AlertContext";
import * as organization from "../api/organization";
import OrganizationView from "./OrganizationView";

interface OrganizationPageProps {
    user: UserModel
}

enum OrganizationViewType {
    Summary,
    Robot,
    Part
}

const OrganizationPage = (props: OrganizationPageProps) => {
    const { user } = props
    const [organizations, setOrganizations] = useState<OrganizationModel[]>([])
    const [activeOrganizationIndex, setActiveOrganizationIndex] = useState(0)
    const viewItemStack = useStack<OrganizationViewType>(
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

    const currentItem = viewItemStack.peek()
    console.log(currentItem, organizations, activeOrganizationIndex)
    switch (currentItem) {
        case OrganizationViewType.Summary:
            return (
                <>
                    {organizations[activeOrganizationIndex] && (
                        <OrganizationView
                            user={user}
                            organizations={organizations}
                            activeOrganization={organizations[activeOrganizationIndex]}
                            handleOrganizationSwitch={handleOrganizationChange}
                            handleUpdateOrganization={handleUpdateOrganization}
                        />
                    )}
                </>
            )

        default:
            return <>no organizations</>
    }
}

export default OrganizationPage