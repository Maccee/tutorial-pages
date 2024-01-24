import { useMap } from "react-leaflet";
import {
    GlobeAltIcon,
    MagnifyingGlassPlusIcon,
    MagnifyingGlassMinusIcon
} from "@heroicons/react/24/outline";

export const ZoomControl = ({ showAlue, setShowAlue }) => {
  const map = useMap();
  const toggleAlue = () => {
    setShowAlue(!showAlue);
  };
  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };
  return (
    <div className="flex flex-col absolute right-2 top-2">
  <button
    onClick={zoomIn}
    className="text-xl w-8 h-8 bg-white text-white mb-1 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center"
  >
    <MagnifyingGlassPlusIcon className="h-6 text-blue-900 "/>
  </button>
  <button
    onClick={zoomOut}
    className="text-xl w-8 h-8 bg-white text-white mb-1 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center"
  >
    <MagnifyingGlassMinusIcon className="h-6 text-blue-900"/>
  </button>
  <button
      onClick={toggleAlue}
      className="text-xl w-8 h-8 bg-white text-white mb-1 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center shadow-black"
      // Adjust top-[5rem] as needed to position below the ZoomControl
    >
      {showAlue ? <GlobeAltIcon className="h-6 text-blue-900" /> : <GlobeAltIcon className="h-6 text-gray-300" />}
    </button>
</div>
  );
};


