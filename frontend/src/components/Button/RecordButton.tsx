import { useEffect, useRef, useState } from "react";
import { apiClientWithAuth } from "services/api/service";

interface RecordButtonProps {
    setIsUploading: (uploading: boolean) => void;
}

export default function RecordButton({ setIsUploading }: RecordButtonProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setElapsedSeconds(0);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'video/webm' });

                const formData = new FormData();
                formData.append('file', file);

                try {
                    setIsUploading(true);
                    await apiClientWithAuth.post('conferences/upload-recording/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    alert('Файл успешно загружен.');
                } catch (error: any) {
                    if (error.response) {
                        const message = error.response.data?.error || `Ошибка загрузки. Код: ${error.response.status}`;
                        alert(message);
                    } else {
                        console.error('Ошибка сети:', error);
                        alert(`Ошибка сети: ${error.message}`);
                    }
                } finally {
                    setIsUploading(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            startTimer();
        } catch (error) {
            console.error('Ошибка начала записи:', error);
            alert('Ошибка при старте записи.');
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        stopTimer();
    };

    const handleClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    useEffect(() => {
        return () => {
            stopTimer();
        };
    }, []);

    return (
        <div className="flex flex-col items-center gap-2 m-4">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleClick}
                    className={`w-12 h-12 rounded-md flex items-center justify-center transition ${
                        isRecording ? "bg-red-600 animate-pulse" : "bg-[#141414] hover:bg-[#2a2a2a]"
                    }`}
                    title={isRecording ? "Остановить запись" : "Начать запись"}
                >
                    <div className="w-2 h-2 rounded-full bg-white" />
                </button>

                {isRecording && (
                    <div className="flex items-center gap-2 text-white text-sm opacity-70">
                        <span>{formatTime(elapsedSeconds)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
