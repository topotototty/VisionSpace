import { forwardRef, memo, useCallback } from "react";

const HomeButtonMeet = forwardRef<HTMLDivElement, {
    color: string,
    title: string,
    description: string,
    icon: string,
    onClick: () => void
}>((
    { color, title, description, icon, onClick }, ref
) => {

    // Используя useCallback, чтобы не создавать новую функцию при каждом клике
    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event) onClick();
    }, [onClick]);


    const colorTheme = {
        'blue': 'bg-blue-1',
        'orange': 'bg-orange-1'
    }

    return (
        <div className={`
            min-w-[300px]
            min-h-[300px]
            w-full
            h-[300px]
            rounded-[20px]
            ${colorTheme[color]}
            cursor-pointer
            hover:shadow-[0_0_10px_0_rgba(0,0,0,0.2)]
            hover:bg-opacity-80

            max-sm:min-w-[200px]
            max-sm:min-h-[120px]
            max-sm:h-[280px]
        `} onClick={handleClick} ref={ref}>
            <div className="flex flex-col justify-between h-full">
                <div className="w-[80px] ml-8 mt-8 bg-white border
                 border-white border-opacity-40 bg-opacity-[25%] rounded-[10px] 
                 backdrop-blur-sm noselect
                 
                 max-sm:w-[70px]
                 max-sm:mt-5
                 max-sm:ml-5">
                    <img
                        src={icon}
                        alt={title}
                        width={80}
                        height={80}
                        style={{ filter: 'invert(100%)' }}
                        className="opacity-100"
                    />
                </div>
                <div className="flex flex-col noselect
                    mb-8 ml-8
                    max-sm:mt-5
                    max-sm:ml-5
                    ">
                    <p className="text-xl font-bold max-sm:text-lg">{title}</p>
                    <span className="text-lg max-sm:text-md">{description}</span>
                </div>
            </div>
        </div>
    )
})
export default memo(HomeButtonMeet)