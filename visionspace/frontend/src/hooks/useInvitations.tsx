import { IInvitation } from "models/Invitation";
import { createContext, FC, useContext, useEffect, useState } from "react"
import { useAuth } from "hooks/useAuth";
import InvitationsService from "services/invitation/service";
import { useConferences } from "hooks/useConferences";

interface InvitationsContextType {
    invitations: IInvitation[],
    acceptedInvitations: IInvitation[],
    declinedInvitations: IInvitation[],
    pendingInvitations: IInvitation[],
    loading: boolean,
    getInvitations: () => void,
    acceptInvitation: (id: string) => void,
    declineInvitation: (id: string) => void,
}


const InvitationsContext = createContext<InvitationsContextType | undefined>(undefined);


export const useInvitations = () => {
    const context = useContext(InvitationsContext);
    if (context === undefined) {
        throw new Error("useInvitations must be used within an InvitationsProvider");
    }

    return context;
}


export const InvitationsProvider: FC<{children: React.ReactNode}> = ({children}) => {
    const [invitations, setInvitations] = useState<IInvitation[]>({} as IInvitation[]);
    const [acceptedInvitations, setAcceptedInvitations] = useState<IInvitation[]>({} as IInvitation[]);
    const [declinedInvitations, setDeclinedInvitations] = useState<IInvitation[]>({} as IInvitation[]);
    const [pendingInvitations, setPendingInvitations] = useState<IInvitation[]>({} as IInvitation[]);
    const {getConferences} = useConferences();

    const [loading, setLoading] = useState<boolean>(true);
    const {user} = useAuth();

    const getInvitations = () => {
        if (user) {
            InvitationsService.getMy().then((data) => {
                // Установка всех инвайтов
                setInvitations(data);

                // Установка принятых инвайтов
                const accepted = data.filter(invitation => invitation.invitation_status === "ACCEPTED");
                setAcceptedInvitations(accepted);

                // Установка не принятых инвайтов
                const declined = data.filter(invitation => invitation.invitation_status === "DECLINED");
                setDeclinedInvitations(declined);

                // Установка ожидающих инвайтов
                const pending = data.filter(invitation => invitation.invitation_status !== "ACCEPTED" && invitation.invitation_status !== "DECLINED")
                setPendingInvitations(pending);
            })
            setLoading(false);
        } else {
            setInvitations({} as IInvitation[]);
        }
    }


    const acceptInvitation = (id: string) => {
        InvitationsService.changeStatus(id, "accept");
        setInvitations(invitations.map(invitation => invitation.id === id ? {...invitation, invitation_status: "ACCEPTED"} : invitation));
        getConferences();
    }

    const declineInvitation = (id: string) => {
        InvitationsService.changeStatus(id, "decline");
        setInvitations(invitations.map(invitation => invitation.id === id ? {...invitation, invitation_status: "DECLINED"} : invitation));
    }


    useEffect(() => {
        getInvitations();
        const notifyInterval = setInterval(async () => {
            getInvitations()
        }, 5000)
        return () => clearInterval(notifyInterval)
    }, [user]);


    return <InvitationsContext.Provider value={
        {
            invitations,
            acceptedInvitations,
            declinedInvitations,
            pendingInvitations,
            loading,
            getInvitations,
            acceptInvitation,
            declineInvitation
        }
    }>
        {children}
    </InvitationsContext.Provider>;
}
