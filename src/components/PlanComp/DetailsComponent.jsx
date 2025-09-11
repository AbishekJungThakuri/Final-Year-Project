import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaceByIdThunk } from "../../features/plan/LocationSlice";
import { fetchRecommandedTransport } from "../../features/service/TransportSlice";
import { fetchRecommandedAccommodation } from "../../features/service/AccommodationSlice";
import { Bed, Clock, MapPin, Coins, BusFront, Ruler, Contact, Phone } from "lucide-react";
import ImageCarousel from "../ui/imageCarousel"; 

const DetailsComponent = ({ detailsData }) => {
  const dispatch = useDispatch();
  const { category, id } = detailsData || {};

  const place = useSelector((state) => state.location.placeDetails);
  const transport = useSelector((state) => state.transport.currentTransport);
  const accommodation = useSelector(
    (state) => state.accommodation.currentAccommodation
  );

  useEffect(() => {
    if (!id || !category) return;

    switch (category) {
      case "place":
        dispatch(fetchPlaceByIdThunk(id));
        break;
      case "transport":
        dispatch(fetchRecommandedTransport(id));
        break;
      case "accommodation":
        dispatch(fetchRecommandedAccommodation(id));
        break;
    }
  }, [id, category, dispatch]);

  if (!id || !category) {
    return (
      <div className="h-[90%] p-6 text-muted-foreground flex justify-center items-center">
        No item selected. Please select an item to see the details.
      </div>
    );
  }

  const data =
    category === "place"
      ? place
      : category === "transport"
      ? transport
      : accommodation;

  if (!data) {
    return <div className="p-6 text-muted-foreground">Loading details...</div>;
  }

  const images = data.images || [];
  const title =
    category === "transport"
      ? `${data.start_city?.name} - ${data.end_city?.name} Bus Service`
      : data.name;

  const subtitle = category === "accommodation" ? data.full_address : null;

  const metaInfo = [];

  if (category === "place") {
    data.categories.forEach(cat => {
      metaInfo.push({
        icon: "",
        value: cat.charAt(0).toUpperCase() + cat.slice(1),
      });
    });
    
    metaInfo.push(
      {
        icon: <Coins className="w-4 h-4" />,
        value: `Rs. ${data.average_visit_cost}`,
      },
      {
        icon: <Clock className="w-4 h-4" />,
        value: `${data.average_visit_duration} hrs`,
      }
    );
    
  } else if (category === "accommodation") {
    metaInfo.push(
      {icon: <Phone className="w-4 h-4" />, value: data.contact},
      { icon: <Bed className="w-4 h-4" />, value: data.accommodation_category },
      {
        icon: <Coins className="w-4 h-4" />,
        value: `Rs. ${data.cost_per_night}`,
      }
    );
  } else if (category === "transport") {
    metaInfo.push(
      {
        icon: <Phone className="w-4 h-4" />,
        value: data.contact,
      },
      {
        icon: <BusFront className="w-4 h-4" />,
        value: data.transport_category,
      },
      {
        icon: <Ruler className="w-4 h-4" />,
        value: `${data.total_distance} km`,
      },
      {
        icon: <Clock className="w-4 h-4" />,
        value: `${data.average_duration} hrs`,
      },
      { icon: <Coins className="w-4 h-4" />, value: `Rs. ${data.cost}` }
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto space-y-2">
      <ImageCarousel images={images.map((img) => img.url)} />

      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-white">
        {metaInfo.map((item, idx) => (
          <div
            key={idx}
            className="flex bg-primary rounded px-4 py-1 items-center gap-1"
          >
            {item.icon}
            <span className="capitalize">{item.value}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-foreground">{data.description}</p>

      {category === "place" && data.place_activities?.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mt-4">Activities</h3>
          <div className="grid grid-cols-1 gap-4">
            {data.place_activities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 border rounded-xl shadow bg-white"
              >
                <img
                  src={activity.activity.image?.url}
                  alt={activity.activity.name}
                  className="h-24 w-32 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between">
                  <h4 className="text-md font-bold">{activity.title}</h4>

                  <div className="flex gap-2 my-1">
                    <div className="text-xs flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.average_duration}h
                    </div>
                    <div className="text-xs flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-muted-foreground">
                      <Coins className="w-3 h-3" />
                      Rs. {activity.average_cost}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsComponent;
