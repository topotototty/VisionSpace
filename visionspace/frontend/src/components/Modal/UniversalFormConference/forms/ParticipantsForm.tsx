import { useEffect, useState } from "react";
import { apiClientWithAuth } from "services/api/service";
import { IUser } from "models/User";
import UserService from "services/user/service";


type ParticipantsFormData = {
    participants: string[]
}

type ParticipantsFormProps = ParticipantsFormData & {
    updateFields: (fields: Partial<ParticipantsFormData>) => void
}


export function ParticipantsForm({ participants, updateFields }: ParticipantsFormProps) {

    const [members, setMembers] = useState(participants || []);
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<IUser[]>([]);

    useEffect(() => {
        updateFields({ participants: members });
    }, [members]);

    useEffect(() => {
        if (inputValue && inputValue.length > 3) {
            // запрос на API для поиск пользователя
            fetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
        }
    }, [inputValue]);

    function fetchSuggestions(query: string) {
        apiClientWithAuth.get('users/profile/search/?q=' + query)
            .then(response => response.data)
            .then(data => setSuggestions(data))
            .catch(error => console.error("Ошибка при получении подсказок", error));
    }

    function addMember(member: string) {
        if (member !== UserService.getUser()?.email){
            if (!members.includes(member)) {
                setMembers(prev => [...prev, member]);
                setInputValue("");
                setSuggestions([]);
            }
        } else {
            alert("Вы не можете добавить себя в список участников, потому что вы - организатор данной встречи.")
            setInputValue("");
            setSuggestions([]);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (suggestions.length > 0) {
                addMember(suggestions[0].email);
            }
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <label className="relative font-medium">
                    <span className="text-base font-medium pb-2">Добавьте участников</span>
                    <input
                        autoFocus
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ник, почта, имя или фамилия пользователя"
                        className="w-full rounded-[6px] text-left px-3 
                bg-inherit h-10 outline-none border-[0.01px] 
                border-white border-opacity-10 text-white 
                placeholder:text-opacity-60 text-[0.865rem]"
                    />
                    <div className="flex flex-col rounded-sm mb-2">
                        {suggestions && suggestions.length > 0 && (
                            <div className="w-full h-full flex flex-col gap-2 border mt-[0.2rem] text-white text-opacity-90 border-white border-opacity-10 rounded-lg">
                                {suggestions.map((suggestion, index) => (
                                    <span
                                        key={index}
                                        onClick={() => addMember(suggestion.email)}
                                        className="w-full cursor-pointer p-2"
                                    >
                                        {suggestion.firstname} {suggestion.lastname} | {suggestion.email}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </label>
                <div className="flex flex-col gap-2 flex-wrap bg-transparent 
                    bg-opacity-50 rounded-sm border border-white border-opacity-10 p-2">
                    <span className="text-base font-medium">Список приглашённых пользователей</span>
                    {members.length > 0 ? (
                        <div className="flex flex-wrap gap-2 w-fit">
                            {members.map((member, index) => (
                                <div key={index}
                                className="w-fit border-[0.01px] border-white text-white border-opacity-20 
                                rounded-md px-2 py-1 font-[400] cursor-pointer flex justify-center items-center gap-2
                                hover:bg-white hover:bg-opacity-10">
                                    <span>{member}</span>
                                    <span className="hover:bg-white hover:bg-opacity-10"
                                    onClick={() => {
                                        setMembers(prev => prev.filter(m => m !== member));
                                    }}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.25 0.75L0.75 11.25" stroke="red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M11.25 11.25L0.75 0.75" stroke="red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span>Список пуст</span>
                    )}
                </div>
            </div>

        </>
    )
}
