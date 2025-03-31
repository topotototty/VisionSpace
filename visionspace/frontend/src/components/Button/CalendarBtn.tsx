import React from "react";

type ButtonCalendarProps = {
  day: string
  onClick?: () => void
  disabled?: boolean
  isSelected?: boolean
}

const ButtonCalendar: React.FC<ButtonCalendarProps> = ({
  day,
  onClick,
  disabled = false,
  isSelected = false
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick ? onClick() : alert(day);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        ${disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer hover:bg-blue-1'}
        ${isSelected ? 'bg-black text-white' : 'bg-gray-1'}
        border-[0.01px] border-gray-3 border-opacity-10
        p-[5px] rounded-[6px] max-w-[40px] text-center transition duration-150 ease-in-out
      `}
    >
      {day}
    </div>
  );
};

export default ButtonCalendar;
