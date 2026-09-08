import { useContext, useEffect, useState } from "react";
import { MapManagerContext } from "./MapManager";
import data from "./data.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

export default function Overlay() {
  const mapManager = useContext(MapManagerContext);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    mapManager.init();
  }, [mapManager]);

  return (
    <div
      className={
        "fixed h-full w-80 transition right-0 " +
        (hidden ? "translate-x-75" : "")
      }
    >
      <button
        className="fixed -translate-x-5 top-3 bg-white text-yellow-400 rounded-full w-6 h-6 text-center cursor-pointer"
        onClick={() => setHidden((hidden) => !hidden)}
      >
        <FontAwesomeIcon icon={hidden ? faAnglesLeft : faAnglesRight} />
      </button>
      <div className="flex flex-col gap-2 h-full overflow-scroll p-2">
        {data.map((d) => (
          <div
            key={d.id}
            className={
              "bg-white/90 text-black p-2 rounded-xl cursor-pointer border-2" +
              (d.id === mapManager.selected
                ? " border-amber-500"
                : " border-white")
            }
            onClick={() => {
              mapManager.center(d.longitude, d.latitude);
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
