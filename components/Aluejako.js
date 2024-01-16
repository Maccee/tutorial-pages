import React from "react";
import jsonDataHel from "../public/aluejakoHelsinki.json";
import jsonDataVan from "../public/aluejakoVantaa.json";
import jsonDataEsp from "../public/aluejakoEspoo.json";

import { Polyline } from "react-leaflet";

export const Aluejako = ({ showPolyline }) => {
  return (
    <>
      {showPolyline &&
        jsonDataHel.features.map((feature, index) => (
          <Polyline
            key={index}
            color="blue"
            weight={1}
            opacity={0.7}
            interactive={true}
            className="my-custom-polyline"
            positions={feature.geometry.coordinates[0].map((coord) => [
              coord[0], // longitude
              coord[1], // latitude
            ])}
          />
        ))}
      {showPolyline &&
        jsonDataVan.features.map((feature, index) => (
          <Polyline
            key={index}
            color="black"
            weight={1}
            opacity={0.7}
            interactive={true}
            className="my-custom-polyline"
            positions={feature.geometry.coordinates[0].map((coord) => [
              coord[0], // longitude
              coord[1], // latitude
            ])}
          />
        ))}
      {showPolyline &&
        jsonDataEsp.ResultArray.flatMap((resultArray) =>
          resultArray.flatMap((item) =>
            item.geoJSON.flatMap((geoJSONItem) => {
              if (geoJSONItem.geometry && geoJSONItem.geometry.members) {
                return geoJSONItem.geometry.members.flatMap((member) => {
                  if (
                    member.geometry.type === "Polygon" ||
                    member.geometry.type === "MultiPolygon"
                  ) {
                    return member.geometry.coordinates.map((ring) =>
                      ring.map((coord) => [coord[0], coord[1]])
                    );
                  } else {
                    return [];
                  }
                });
              }
              return [];
            })
          )
        ).map((positions, index) => (
          <Polyline
            key={index}
            color="black"
            weight={1}
            opacity={0.7}
            interactive={true}
            className="my-custom-polyline"
            positions={positions}
          />
        ))}
    </>
  );
};
