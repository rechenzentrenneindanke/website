import { useContext, useEffect } from "react";
import { MapManagerContext } from "./MapManager";
import data from "./data.json";

export default function Overlay() {
  const mapManager = useContext(MapManagerContext);

  useEffect(() => {
    mapManager.init();
  },[mapManager]);

  return (
    <div className="fixed h-full w-80 right-0">
      <div className="flex flex-col gap-2 h-full overflow-scroll p-2">
        {data.map((d) => (
          <div
            key={d.id}
            className={
              "bg-white/90 text-black p-2 rounded-xl cursor-pointer border-2" +
              (d.id === mapManager.selected ? " border-amber-500" : " border-white")
            }
            onClick={() => {
              mapManager.center(d.longitude, d.latitude)
              mapManager.select(d.id);
            }}
          >
            <div className="text-lg">{d.project}</div>
            <p>
              location: {d.location}
              <br />
              status: {d.status}
              <br />
              capacity: {d.capacity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
