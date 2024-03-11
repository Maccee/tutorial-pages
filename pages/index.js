import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import ProgressBar from "@/components/ProgressBar";
import Header from "@/components/Header";
import { fetchData } from "@/components/ApiUtils";
import { Cards } from "@/components/Cards";
import { Login } from "@/components/Login";
import Modal from "@/components/Modal";
import { throttle } from "@/components/UtilityFunctions";
import { Bars2Icon } from "@heroicons/react/24/outline";

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
  const [mapContainerHeight, setMapContainerHeight] = useState(500);

  // hook to make a api request as the search keyword changes, its changed from the header component
  useEffect(() => {
    if (keyword) {
      setMarkers([]);
      setProgress(0);
      const initialUrl = `https://api.hel.fi/linkedevents/v1/place/?text=${keyword}&has_upcoming_event=false&show_all_places=true`;
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
  }

  const handleDrag = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    let startHeight = mapContainerHeight;
    // Wrap the doDrag logic with the throttle function
    const doDrag = throttle((dragEvent) => {
      const newY = dragEvent.clientY;
      const diffY = newY - startY;
      const newHeight = Math.max(20, startHeight + diffY);
      setMapContainerHeight(newHeight);
    }, 50); // Throttle drag updates to run at most every 50 milliseconds
    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  return (
    <>
      <ProgressBar totalItems={100} itemsProcessed={progress} />
      <div className="sticky top-0 z-50">
        <Header
          setKeyword={setKeyword}
          isMapVisible={isMapVisible}
          setIsMapVisible={setIsMapVisible}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          token={token}
          setMapContainerHeight={setMapContainerHeight}
        />

      </div>





      <div
        className={`transition-all duration-500 overflow-hidden ${isMapVisible ? "opacity-100 " : "opacity-0"
          } relative`}
        style={{ maxHeight: `${mapContainerHeight}px` }}
      >
        <MapComponentWithNoSSR
          markers={markers}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          setIsMapVisible={setIsMapVisible}
        />
        <div
          className="cursor-ns-resize absolute bottom-0 left-0 right-0 bg-gray-100 flex w-full items-center justify-center"
          onMouseDown={handleDrag}
          style={{ height: "20px" }}
        >
          <Bars2Icon className="h-6 text-logoBlue" />
        </div>
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
