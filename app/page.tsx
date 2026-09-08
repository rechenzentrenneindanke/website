"use client";
import MapManager from "./MapManager";
import Overlay from "./Overlay";

export default function Home() {
  return (
    <MapManager>
      <Overlay/>
    </MapManager>
  );
}
