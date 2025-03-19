import { useState } from "react";
import UniversalFormConference from "components/Modal/UniversalFormConference/universalFormConference";
import { Button } from "components/Button/button";


const Calendar = () => {
	const [openCreateMeet, setOpenCreateMeet] = useState(false);
    const [currentWeek] = useState(new Date());

	return (
		<section className="flex size-full flex-col gap-5 pt-4
        max-sm:flex-col
        max-md:flex-col
        max-lg:flex-col

        ">
            <div className="flex flex-row justify-between ml-2">
                <div className="text-3xl flex flex-row justify-start items-center">
                    <img
                        src={"/images/calendar.svg"}
                        alt="Календарь"
                        width={50}
                        height={50}
                        style={{'filter': 'invert(1)'}}
                    />
                    <span className="ml-2 text-[20px] font-bold">
                        {/* Август, 12 - Август, 16, 2024 */}
                        {currentWeek.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
                <div className="flex flex-row justify-end items-center gap-4">
                    <Button className="bg-blue-1
                                hover:bg-blue-1 font-bold text-[16px]
                                hover:bg-opacity-50">
                        <img
                            src={"/icons/chevron-left.svg"}
                            alt="Лево"
                            width={40}
                            height={40}
                            style={{'filter': 'invert(1)'}}
                        />
                    </Button>
                    <Button className="bg-blue-1
                                hover:bg-blue-1 font-bold text-[16px]
                                hover:bg-opacity-50">
                        <img
                            src={"/icons/chevron-right.svg"}
                            alt="Право"
                            width={40}
                            height={40}
                            style={{'filter': 'invert(1)'}}
                        />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="flex flex-row justify-start mt-0">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="border-2 border-gray-3 border-opacity-10 p-5">
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                        <span>Понедельник</span>
                                        <span className="bg-blue-1 px-2 py-[2px] rounded-[5px] 
                                        border-2 border-gray-3 border-opacity-10">2</span>
                                    </div>
                                </div>
                                <span className="text-gray-3 text-opacity-60 w-full flex">12, августа</span>
                            </th>
                            <th  className="border-2 border-gray-3 border-opacity-10 p-5">
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                        <span>Вторник</span>
                                        <span className="bg-gray-2 px-2 py-[2px] rounded-[5px]
                                        border-2 border-gray-3 border-opacity-10">0</span>
                                    </div>
                                </div>
                                <span className="text-gray-3 text-opacity-60 w-full flex">13, августа</span>
                            </th>
                            <th  className="border-2 border-gray-3 border-opacity-10 p-5">
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                        <span>Среда</span>
                                        <span className="bg-blue-1 px-2 py-[2px] rounded-[5px] 
                                        border-2 border-gray-3 border-opacity-10">3</span>
                                    </div>
                                </div>
                                <span className="text-gray-3 text-opacity-60 w-full flex">14, августа</span>
                            </th>
                            <th  className="border-2 border-gray-3 border-opacity-10 p-5">
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                        <span>Четверг</span>
                                        <span className="bg-gray-2 px-2 py-[2px] rounded-[5px]
                                        border-2 border-gray-3 border-opacity-10">0</span>
                                    </div>
                                </div>
                                <span className="text-gray-3 text-opacity-60 w-full flex">15, августа</span>
                            </th>
                            <th  className="border-2 border-gray-3 border-opacity-10 p-5">
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                        <span>Пятница</span>
                                        <span className="bg-purple-1 px-2 py-[2px] rounded-[5px]
                                        border-2 border-gray-3 border-opacity-10">1</span>
                                    </div>
                                </div>
                                <span className="text-gray-3 text-opacity-60 w-full flex">16, августа</span>
                            </th>
                            {/* { Array(weekdays.length).fill(0).map((_, index) => (
                                <th  className="border-2 border-gray-3 border-opacity-10 p-5">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-between">
                                            <span>{weekdays[index]}</span>
                                            <span className="bg-blue-1 px-2 py-[2px] rounded-[5px]">1</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-3 text-opacity-60 w-full flex">23, ноября</span>
                                </th>
                            ))} */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">8:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10">
                                <div className="flex flex-col p-4 bg-blue-1 rounded-[12px] w-full border-2 border-gray-3 border-opacity-10">
                                    <span className="text-white p-1 font-bold">Design Daily Zoom Meeting</span>
                                    <div className="flex flex-row gap-2 items-center opacity-80">
                                        <img
                                        src={"/images/calendar.svg"} alt="Календарь" width={32} height={32} style={{'filter': 'invert(1)'}}/>
                                        <span>8:30-9:30</span>
                                    </div>
                                </div>
                            </td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">9:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10">
                                <div className="flex flex-col p-4 bg-gray-1 rounded-[12px] w-full border-2 border-gray-3 border-opacity-10">
                                    <span className="text-white p-1 font-bold">Design Daily Zoom Meeting</span>
                                    <div className="flex flex-row gap-2 items-center opacity-80">
                                        <img
                                        src={"/images/calendar.svg"} alt="Календарь" width={32} height={32} style={{'filter': 'invert(1)'}}/>
                                        <span>8:30-9:30</span>
                                    </div>
                                </div></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">10:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">11:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">12:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10">
                                <div className="flex flex-col p-4 bg-blue-1 rounded-[12px] w-full border-2 border-gray-3 border-opacity-10">
                                    <span className="text-white p-1 font-bold">Design Daily Zoom Meeting</span>
                                    <div className="flex flex-row gap-2 items-center opacity-80">
                                        <img
                                        src={"/images/calendar.svg"} alt="Календарь" width={32} height={32} style={{'filter': 'invert(1)'}}/>
                                        <span>11:00-12:00</span>
                                    </div>
                                </div>
                            </td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">13:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">14:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">15:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">16:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">17:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">18:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">19:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">20:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">21:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                        <tr className="h-20">
                            <td className="text-end w-[60px] pr-5 text-opacity-40 text-white">22:00</td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                            <td className="border-2 border-gray-3 border-opacity-10"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

			<UniversalFormConference
				open={openCreateMeet}
				setOpen={() => {
                    setOpenCreateMeet(false);
                }}
                button={<></>}
			/>
        </section>
	)
}

export default Calendar