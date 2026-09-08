"use client";
import MapManager from "./MapManager";
import Overlay from "./Overlay";

export default function Home() {
  return (
    <MapManager>
      <div className="fixed w-full h-full" id="map"></div>
      <Overlay/>
    </MapManager>
  );
}
