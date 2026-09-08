import { createContext, useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import data from "./data.json";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Select, { SelectEvent } from "ol/interaction/Select";

type InitFunc = () => void;
type CenterFunc = (lon: number, lat: number) => void;
type SelectFunc = (id: string) => void;

interface ContextProps {
  init: InitFunc;
  center: CenterFunc;
  select: SelectFunc;
  selected: string | null;
}

const initialContextProps: ContextProps = {
  init: () => {},
  center: () => {},
  select: () => {},
  selected: null,
};

export const MapManagerContext =
  createContext<ContextProps>(initialContextProps);

type Props = {
  children: React.ReactNode;
};

export default function StandManager({ children }: Props) {
  const mapRef = useRef<Map>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const init: InitFunc = () => {
    if (mapRef.current) return;
    const onFeatureSelect = (e: SelectEvent) => {
      if (e.selected.length > 0) {
        const feature = e.selected[0];
        const id = feature.getProperties().id;
        if (id) {
          setSelected(id);
        }
      } else {
        setSelected(null);
      }
    };

    const selectInteraction = new Select({
      style: new Style({
        image: new Icon({
          src: "./rnd.png",
          anchor: [0.5, 0.5],
          scale: 0.03,
        }),
      }),
    });
    selectInteraction.on("select", onFeatureSelect);

    const features = data.map((d) => {
      const feature = new Feature<Point>(
        new Point(fromLonLat([d.longitude, d.latitude])),
      );
      feature.setProperties({ id: d.id });
      return feature;
    });

    const source = new VectorSource();
    source.addFeatures(features);

    const layer = new VectorLayer({
      source: source,
      style: new Style({
        image: new Icon({
          src: "./rnd.png",
          anchor: [0.5, 0.5],
          scale: 0.02,
        }),
      }),
      properties: { name: "layer" },
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://mapsneu.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg",
            attributions: "Stadt Wien - data.wien.gv.at",
            attributionsCollapsible: true,
          }),
        }),
        new TileLayer({
          source: new XYZ({
            url: "https://mapsneu.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png",
            attributions: "Stadt Wien - data.wien.gv.at",
            attributionsCollapsible: true,
          }),
        }),
        layer,
      ],
      view: new View({
        center: fromLonLat([15.8, 47.762]),
        zoom: 9,
      }),
    });

    map.addInteraction(selectInteraction);

    mapRef.current = map;
  };

  const center: CenterFunc = (lon, lat) => {
    if (!mapRef.current) return;

    const minZoom = 15;
    const view: View = mapRef.current.getView();
    const zoom = view.getZoom() ?? minZoom;
    view.animate({
      center: fromLonLat([lon, lat]),
      zoom: zoom > minZoom ? zoom : minZoom,
    });
  };

  const select: SelectFunc = (id) => {
    if (!mapRef.current) return;

    const layers = mapRef.current.getLayers().getArray();
    const layer = layers.find(
      (l) => l.getProperties().name === "layer",
    ) as VectorLayer;
    if (!layer) return;
    const source = layer.getSource();
    if (!source) return;
    const features = source.getFeatures();
    const feature = features.find((f) => f.getProperties().id === id);
    if (!feature) return;

    const interactions = mapRef.current.getInteractions().getArray();
    const selectInteraction = interactions.find(
      (l) => l instanceof Select,
    ) as Select;
    if (!selectInteraction) return;

    selectInteraction.clearSelection();
    selectInteraction.selectFeature(feature);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <MapManagerContext
      value={{
        init,
        center,
        select,
        selected,
      }}
    >
      <div className="fixed w-full h-full" id="map"></div>
      {children}
    </MapManagerContext>
  );
}
