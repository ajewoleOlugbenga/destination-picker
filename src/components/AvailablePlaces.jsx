import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Errors from "./Errors";
import { sortPlacesByDistance } from "../loc";
import { fetchingAvailablePlaces } from "./https.js";
import { useFetch } from "../hooks/useFetch";

async function fetchSortedPlaces() {
  const places = await fetchingAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );
      resolve(sortedPlaces);
    });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching,
    error,
    fetchedData: availablePlaces,
  } = useFetch(fetchSortedPlaces, []);

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
