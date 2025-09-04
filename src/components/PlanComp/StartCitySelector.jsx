import { fetchCitiesThunk } from "../../features/plan/LocationSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const StartCitySelector = ({ 
    handleUpdatePlan,
    setShowCitySearch
}) => {
    const dispatch = useDispatch();
    const [citySearch, setCitySearch] = useState("");
    const [cityOptions, setCityOptions] = useState([]);

    const { cities = [] } = useSelector((state) => state.location || {});
    useEffect(() => {
      setCityOptions(cities);
    }, [cities]);

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <input
                type="text"
                value={citySearch}
                onChange={(e) => {
                    setCitySearch(e.target.value);
                    dispatch(
                        fetchCitiesThunk({ search: e.target.value })
                    );
                }}
                placeholder="Search city..."
                autoFocus
                className="w-full z-100 border-b border-gray-200 px-3 py-2 text-sm focus:outline-none"
            />
            {cityOptions.length > 0 ? (
                <ul className="max-h-48 overflow-y-auto">
                    {cityOptions.map((city) => (
                        <li
                            key={city.id}
                            onClick={() => {
                                setCitySearch("");
                                setCityOptions([]);
                                setShowCitySearch(false);
                                handleUpdatePlan({ start_city_id: city.id });
                            }}
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                            {city.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-2 text-xs text-gray-400">
                    No results
                </div>
            )}
        </div>
    )
}

export default StartCitySelector;