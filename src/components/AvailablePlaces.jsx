import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Errors from "./Errors";
import { sortPlacesByDistance } from "../loc";
import { fetchingAvailablePlaces } from "./https.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsFetching(true);
      try {
        const places = await fetchingAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
           places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch data please try again later",
        });
      }

      setIsFetching(false);
    };
    fetchPlaces();
  }, []);

  if (error) {
    return <Errors title="An error occured" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      loadingText="fetching data...."
      isLoading={isFetching}
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
