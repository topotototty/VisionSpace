import { Checkbox } from "components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "components/ui/popover"
import { useConferences } from "hooks/useConferences";
import { IFilters } from "models/Conference";
import { useEffect, useState } from "react";


const FilterForm = () => {

	const {
		filters,
		setFilterMany,
	} = useConferences();

	const [showAllSelect, setShowAllSelect] = useState(true);
	const [showFutureSelect, setShowFutureSelect] = useState(filters.showFuture === true);
	const [showPastSelect, setShowPastSelect] = useState(filters.showPast === true);


	function loadFiltersInfo() {
		if (filters.showFuture === true) {
			setShowAllSelect(false);
			setShowFutureSelect(true);
			setShowPastSelect(false);
		}
		else if (filters.showPast === true) {
			setShowAllSelect(false);
			setShowFutureSelect(false);
			setShowPastSelect(true);
		} else {
			setShowAllSelect(true);
			setShowFutureSelect(false);
			setShowPastSelect(false);
		}
	}

	useEffect(() => {
		loadFiltersInfo();
	}, []);

	function showAll() {
		if (showAllSelect) {
			return;
		}
		setFilterMany({
			showFuture: null,
			showPast: null,
		} as IFilters);
		setShowFutureSelect(false);
		setShowPastSelect(false);
		setShowAllSelect(!showAllSelect);
	}

	function showFuture() {
		if (showFutureSelect) {
			return;
		}
		setFilterMany({
			showFuture: true,
			showPast: null,
		} as IFilters);
		setShowFutureSelect(!showFutureSelect);
		setShowPastSelect(false);
		setShowAllSelect(false);
	}

	function showPast() {
		if (showPastSelect) {
			return;
		}
		setFilterMany({
			showFuture: null,
			showPast: true,
		} as IFilters);
		setShowFutureSelect(false);
		setShowPastSelect(!showPastSelect);
		setShowAllSelect(false);
	}

    return (
      <Popover>
        <PopoverTrigger asChild>
            <button className="cursor-pointer noselect flex items-center justify-center px-2 bg-gray-2 rounded-[5px] hover:bg-gray-3 hover:bg-opacity-10 transition-all duration-300">
                <img
                    src="/icons/filters.svg"
                    alt="filters"
                    width={30}
                    height={30}
                    className="cursor-pointer"
                    style={{ filter: 'invert(100%)' }}
                />
            </button>
        </PopoverTrigger>
        <PopoverContent className="border-none bg-gray-2 text-white" align="end">
          <div className="flex flex-col gap-2">
			<div>
				<h4 className="font-medium leading-none">Фильтры</h4>
				<p className="text-sm text-muted-foreground">
					Выберите фильтры
				</p>
			</div>
			<div className="flex flex-col gap-2">
				<div className="cursor-pointer flex flex-col *:text-[0.875rem] *:font-semibold">
					<div className="flex items-center space-x-1">
						<Checkbox
							id="allSelect"
							checked={showAllSelect}
							onCheckedChange={() => {showAll()}}
						/>
						<label htmlFor="allSelect">Все</label>
					</div>

					<div className="flex items-center space-x-1">
						<Checkbox
							id="pastSelect"
							checked={showPastSelect}
							onCheckedChange={() => {showPast()}}
						/>
						<label htmlFor="pastSelect">Прошедшие</label>
					</div>

					<div className="flex items-center space-x-1">
						<Checkbox
							id="futureSelect"
							checked={showFutureSelect}
							onCheckedChange={() => {showFuture()}}
						/>
						<label htmlFor="futureSelect">Будущие</label>
					</div>
				</div>
			</div>

            {/* <div>
              <h4 className="font-medium leading-none">Сортировка</h4>
              <p className="text-sm text-muted-foreground">
                Сортировать по
              </p>
            </div> */}
          </div>
        </PopoverContent>
      </Popover>
    )
}


export default FilterForm