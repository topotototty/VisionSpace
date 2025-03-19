const ButtonCalendar = ({ day, onClick }: {
    day: string,
    onClick?: () => void
}) => {

    function handleClick() {
        if (onClick) onClick()
        else alert(day)
    }

    return (
        <div className="
        bg-gray-1 border-[0.01px] border-gray-3 border-opacity-10
        hover:bg-blue-1 p-[5px] rounded-[6px] max-w-[40px] text-center cursor-pointer" onClick={handleClick}>
            {day}
        </div>
    )
}

export default ButtonCalendar