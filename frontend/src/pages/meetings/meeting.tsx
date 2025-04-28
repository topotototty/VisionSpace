import { jistiConfigOverwrite, jistiInterfaceConfigOverwrite, jitsiDomain } from "constants/index";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useCallback, useEffect, useState } from "react";
import Loader from "components/Loader/loader";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/Button/button";
import { IUser } from "models/User";
import ModalLogin from "components/Modal/Login/loginModal";
import { useAuth } from "hooks/useAuth";
import { useConferences } from "hooks/useConferences";
import ConferencesService from "services/conference/service";
import RecordButton from "components/Button/RecordButton";

const Meeting = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { setActive } = useConferences();

    const [loadingMessage, setLoadingMessage] = useState("Загрузка...");
    const [errorMessage, setErrorMessage] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [token, setToken] = useState("");
    const [userTemp, setUserTemp] = useState<IUser | null>(JSON.parse(localStorage.getItem("userTemp") || "null"));
    const [loginModal, setLoginModal] = useState(false);
    const [isUploadingRecording, setIsUploadingRecording] = useState(false);

    const config = jistiConfigOverwrite;

    const checkUserAuth = useCallback(() => {
        const tempUser = localStorage.getItem("userTemp");
        if (loading) return false;
        if (user || tempUser) return true;
        setLoginModal(true);
        return false;
    }, [user, loading]);

    const getRoomToken = useCallback(() => {
        if (!(user || userTemp)) return;
        const fetchToken = user
            ? ConferencesService.getConferenceToken(id)
            : ConferencesService.getConferenceTokenAsGuest(id, userTemp!.firstname);

        fetchToken.then(({ conference, token }) => {
            setToken(token);
            setIsStarted(true);
            config.subject = conference.title;
        }).catch(console.error);
    }, [id, user, userTemp]);

    const getRoom = useCallback(() => {
        ConferencesService.getConferenceById(id)
            .then(({ conference }) => {
                switch (conference.status) {
                    case "CREATED":
                        setLoadingMessage("Ожидание начала конференции");
                        if (user && conference.creator.id === user.id) {
                            setActive(conference.id);
                        }
                        break;
                    case "STARTED":
                        setLoadingMessage("Подключение к конференции");
                        getRoomToken();
                        break;
                    case "FINISHED":
                        setErrorMessage("Конференция завершена");
                        break;
                    case "CANCELED":
                        setErrorMessage("Конференция отменена организатором");
                        break;
                }
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    console.log("Ошибка авторизации");
                }
            });
    }, [id, user]);

    const checkRoom = () => {
        if (!(user || userTemp) || !isStarted || !token) {
            getRoom();
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!checkUserAuth()) return;

        checkRoom();
        const interval = setInterval(() => checkRoom(), 5000);
        return () => clearInterval(interval);
    }, [id, loading, user, userTemp, isStarted, token]);

    const onApiReady = useCallback(() => {}, []);

    if (loginModal) {
        return (
            <ModalLogin
                open={loginModal}
                onSuccess={(user: IUser) => {
                    setUserTemp(user);
                    localStorage.setItem("userTemp", JSON.stringify(user));
                    setLoginModal(false);
                }}
                setOpen={() => setLoginModal(false)}
            />
        );
    }

    if (!isStarted || !token) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="w-[400px] h-[300px] bg-gray-1 border border-gray-3 border-opacity-10 rounded-2xl flex flex-col items-center justify-around p-6 text-center">
                    <h1 className="text-xl font-bold">Ожидание организатора</h1>
                    <Loader text={loadingMessage} />
                    <div className="text-xs text-white/40">ID: {id}</div>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div className="text-4xl text-white/85">{errorMessage}</div>
                <Button
                    onClick={() => navigate("/meetings")}
                    className="mt-5 bg-transparent text-red-500"
                >
                    Вернуться
                </Button>
            </div>
        );
    }

    return (
        <div className="relative w-screen h-screen">

            {isUploadingRecording && (
                <div className="absolute bottom-3 left-4 z-50 bg-gray-2 px-3 py-1 rounded-lg shadow text-xs text-white">
                    Идёт загрузка...
                </div>
            )}

            {/* Кнопка записи */}
            <div className="absolute bottom-4 left-4 z-50">
                <RecordButton setIsUploading={setIsUploadingRecording} />
            </div>

            {/* Конференция */}
            <JitsiMeeting
                lang="ru"
                jwt={token}
                domain={jitsiDomain}
                roomName={id}
                onReadyToClose={() => navigate(user ? "/meetings" : "/")}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100vh';
                    iframeRef.style.width = '100%';
                    iframeRef.style.zIndex = '10';
                }}
                configOverwrite={{ ...config, startRecording: false }}
                interfaceConfigOverwrite={{
                    ...jistiInterfaceConfigOverwrite,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'chat', 'tileview',
                        'fullscreen', 'videoquality', 'filmstrip', 'settings', 'hangup'
                    ]
                }}
                onApiReady={onApiReady}
            />
        </div>
    );
};

export default Meeting;
