import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { fetchData } from "@/components/ApiUtils";
import { Cards } from "@/components/Cards";
import ProgressBar from "@/components/ProgressBar";
import { Login } from "@/components/Login";
import Modal from "@/components/Modal";


const MapComponentWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [token, setToken] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // hook to make a api request as the search keyword changes, its changed from the header component
  useEffect(() => {
    if (keyword) {
      setMarkers([]);
      setProgress(0);

      const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=true&show_all_places=true`;

      // Progress funtion passed to the fetchdata to dynamically set the progress based on how many markers have been built
      const updateProgress = (progress) => {
        setProgress(progress);
      };

      fetchData(initialUrl, [], updateProgress)
        .then((fetchedMarkers) => {
          setMarkers(fetchedMarkers);

          // Reset the progress after the fetch is complete
          setProgress(0);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [keyword]);

  // map visibility, from a button in header
  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  // login visibility, from a button in header
  const toggleLoginVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };


  return (
    <>
      {/* Display the ProgressBar component with totalItems and itemsProcessed as props */}
      <ProgressBar totalItems={100} itemsProcessed={progress} />

      <div className="sticky top-0 z-50">
        <Header
          setKeyword={setKeyword}
          toggleMapVisibility={toggleMapVisibility}
          toggleLoginVisibility={toggleLoginVisibility}
          token={token}
        />

      </div>
      <div
        className={`transition-all duration-500 ${isMapVisible ? "opacity-100" : "opacity-0 max-h-0"}`}
        style={{ overflow: "hidden", zIndex: "30", background: "white", paddingLeft: '10px', paddingRight: '10px' }}
      >
        <MapComponentWithNoSSR
          markers={markers}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          setIsMapVisible={setIsMapVisible}
        />
      </div>
      <main className="z-0">
        <Cards markers={markers} setSelectedCard={setSelectedCard} />
      </main>
      <footer className="w-full text-center p-4" style={{ bottom: 0 }}>
        <p>Copyright © 2024</p>
      </footer>

      <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <Login setToken={setToken} setIsModalVisible={setIsModalVisible} token={token} />
      </Modal>

    </>
  );
}
