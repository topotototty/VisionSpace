import React, { useState } from 'react';


type ComboBoxProps = {
    options: string[];
    value: string;
    onChange: (value: string) => void;
};

const ComboBox = ({ options, value, onChange }: ComboBoxProps) => {
    const [selectedTime, setSelectedTime] = useState(value);

    // Обработчик изменения выбора
    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedTime(event.target.value);
        onChange(event.target.value.toString());
    };

    return (
        <div className="flex flex-col justify-center cursor-pointer">
            <select
                name="time"
                id="time"
                value={selectedTime}
                onChange={handleChange}
                className="w-40 bg-gray-1 rounded-lg shadow-sm
                focus:outline-none outline-none cursor-pointer
                max-h-20 overflow-y-auto"
                style={{
                    backgroundSize: '10px 10px',
                    overflowY: 'auto',
                }}
            >
                {options.map((time) => (
                    <option key={time} value={time}>
                        {time}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ComboBox;
