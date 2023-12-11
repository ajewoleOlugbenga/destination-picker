import { useEffect, useState } from "react";

export function useFetch(fetchingFn, initialValue) {
  const [error, setError] = useState();
  const [isFetching, setIsFetching] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const places = await fetchingFn();
        setFetchedData(places);
      } catch (error) {
        setError({
          message: error.message || "failed to load data",
        });
      }
      setIsFetching(false);
    }
    fetchData();
  }, [fetchingFn]);

  return {
    fetchedData,
    error,
    isFetching,
    setFetchedData,
  };
}
