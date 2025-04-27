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
    const [loadingMessage, setLoadingMessage] = useState<string>("Загрузка...");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const config = jistiConfigOverwrite;
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { setActive } = useConferences();
    const [userTemp, setUserTemp] = useState<IUser | null>(
        JSON.parse(localStorage.getItem("userTemp") as string) || null
    );
    const [loginModal, setLoginModal] = useState<boolean>(false);

    const checkUserAuth = useCallback(() => {
        const userTemp = localStorage.getItem("userTemp");
        if (loading) return false;
        if (user || userTemp) return true;
        setLoginModal(true);
        return false;
    }, [user, userTemp, loading]);

    const getRoomToken = useCallback(() => {
        if (!(user || userTemp)) return;
        const fetchToken = user
            ? ConferencesService.getConferenceToken(id)
            : ConferencesService.getConferenceTokenAsGuest(id, userTemp!.firstname);

        fetchToken.then(({ conference: conf, token: token }) => {
            setToken(token);
            setIsStarted(true);
            config.subject = conf.title;
        }).catch(error => {
            console.error(error);
        });
    }, [id, user, userTemp]);

    const getRoom = useCallback(() => {
        ConferencesService.getConferenceById(id).then(
            ({ conference }) => {
                switch (conference.status) {
                    case "CREATED":
                        setLoadingMessage("Ожидание начала конференции");
                        if (user && conference.creator.id === user.id) {
                            setActive(conference.id);
                        }
                        return;
                    case "FINISHED":
                        setErrorMessage("Конференция завершена");
                        return;
                    case "CANCELED":
                        setErrorMessage("Конференция отменена организатором");
                        return;
                    case "STARTED":
                        setLoadingMessage("Подключение к конференции");
                        getRoomToken();
                        return;
                }
            }
        ).catch(error => {
            if (error.response?.status === 401) {
                console.log("Ошибка авторизации");
            }
        });
    }, [id, user]);

    const checkRoom = () => {
        if ((user || userTemp) && isStarted && token) {
            return;
        } else {
            getRoom();
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!checkUserAuth()) return;

        checkRoom();
        const getDataInterval = setInterval(() => {
            checkRoom();
        }, 5000);

        return () => clearInterval(getDataInterval);
    }, [id, loading, user, userTemp, isStarted, token]);

    const onApiReady = useCallback(() => {
        // Пока ничего не ловим, потому что записи через стандартную кнопку больше нет
    }, []);
    

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
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div className="w-[500px] h-[400px] bg-gray-1 border-[0.01px] border-gray-3 border-opacity-10 rounded-[20px] flex flex-col justify-between items-center pt-[4.5rem] pb-5 max-md:pt-[4.8rem] max-md:w-[400px] max-md:h-[400px] max-sm:pt-[3rem] max-sm:w-[290px] max-sm:h-[350px]">
                    <h1 className="text-2xl font-bold max-2xl:text-3xl max-md:text-xl max-sm:text-xl max-sm:px-4">
                        Ожидание организатора
                    </h1>
                    <div className="flex flex-col justify-center items-center w-[150px] h-[150px]">
                        <Loader text={loadingMessage} />
                    </div>
                    <div className="text-[12px] text-white text-opacity-35 cursor-pointer max-sm:text-[10px]">
                        ID: {id}
                    </div>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div className="text-extrabold text-4xl max-sm:text-[18px] white text-opacity-85 m-0">
                    {errorMessage}
                </div>
                <Button
                    onClick={() => window.location.href = "/meetings"}
                    className="mt-5 bg-transparent text-red-500"
                >
                    Вернуться
                </Button>
            </div>
        );
    }

    return (
        <div className="relative w-screen h-screen">
            {/* Кастомная кнопка записи */}
            <div className="absolute bottom-4 left-4 z-50">
                <RecordButton />
            </div>
            
            {/* Сам Jitsi */}
            <JitsiMeeting
                lang="ru"
                jwt={token}
                domain={jitsiDomain}
                roomName={id}
                onReadyToClose={() => {
                    if (user) navigate("/meetings");
                    else navigate("/");
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100vh';
                    iframeRef.style.width = '100%';
                    iframeRef.style.zIndex = '10';
                }}
                configOverwrite={{
                    ...config,
                    startRecording: false,
                }}
                interfaceConfigOverwrite={{
                    ...jistiInterfaceConfigOverwrite,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'chat',
                        'tileview', 'fullscreen', 'videoquality', 'filmstrip', 'settings', 'hangup'
                    ],
                }}
                onApiReady={onApiReady}
            />
        </div>
    );
};

export default Meeting;
