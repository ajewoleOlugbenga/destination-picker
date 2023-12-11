import { useCallback, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchingUserPlaces, updatedUserPlaces } from "./components/https.js";
import Error from "./components/Errors.jsx";
import { useFetch } from "./hooks/useFetch.js";

function App() {
  const selectedPlace = useRef();
  const [errorUpdating, setErrorUpdating] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    error,
    isFetching,
    fetchedData: userPlaces,
    setFetchedData,
  } = useFetch(fetchingUserPlaces, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setFetchedData((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updatedUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setFetchedData(userPlaces);
      setErrorUpdating({
        message: error.message || "404 - somthing went wrong",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setFetchedData((prevPickPlace) =>
        prevPickPlace.filter((place) => place.id !== selectedPlace.current.id)
      );

      setModalIsOpen(false);
      try {
        await updatedUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setFetchedData(userPlaces);
        setErrorUpdating({
          message: error.message || "failed to delete place",
        });
      }
    },
    [userPlaces, setFetchedData]
  );

  function handleError() {
    setErrorUpdating(null);
  }

  return (
    <>
      <Modal open={errorUpdating} onClose={handleError}>
        {errorUpdating && (
          <Error
            title="An error occured"
            message={errorUpdating.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>Destination Picker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occured" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="feching your places"
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
