import React, { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { geoCentroid, geoEqualEarth, geoBounds, geoMercator } from "d3-geo";
import { THEME, normalizeCountry, COORDINATES_OVERRIDE } from "../constants";
import { CountryPopularity, OriginData } from "../types";
import LegendOverlay from "./LegendOverlay";
import { Translations } from "openai/resources/audio.mjs";
import MapLegend from "./MapLegend";

interface WorldMapProps {
  popularityData: CountryPopularity[];
  originData?: OriginData | null;
  isLoading: boolean;
  geoData: any;
  indiaGeoData: any;
  hasSearched: boolean;
}

interface BBox {
  name: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface LegendPlacement {
  id: string;
  data: CountryPopularity | OriginData | { message: string };
  centroid?: [number, number];
  box: { x1: number; y1: number; x2: number; y2: number };
  width: number;
  height: number;
  rank?: number;
  isOrigin?: boolean;
  hasLine: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({
  popularityData,
  originData,
  isLoading,
  geoData,
  indiaGeoData,
  hasSearched,
}) => {
  const WIDTH = 1000;
  const HEIGHT = 500;
  const MARGIN = 20;



    const projection = useMemo(
    () =>
      geoMercator()
        .scale(110)
        .center([0, 40])
        .translate([WIDTH / 2, HEIGHT / 2]),
    []
  );

  //   const projection = useMemo(
  //   () =>
  //     geoEqualEarth()
  //       .scale(190)
  //       .center([0, 0])
  //       .translate([WIDTH / 2, HEIGHT / 2]),
  //   []
  // );

  const getCountryCentroid = (name: string): [number, number] | null => {
    const normName = normalizeCountry(name);

    // Check for hardcoded coordinate overrides first (for tiny islands)
    if (COORDINATES_OVERRIDE[normName]) {
      const projected = projection(COORDINATES_OVERRIDE[normName]);
      return projected && projected[0] !== 0
        ? (projected as [number, number])
        : null;
    }

    const feature = geoData?.features.find((f: any) => {
      const fName = normalizeCountry(f.properties.name);
      return (
        fName === normName ||
        fName.includes(normName) ||
        normName.includes(fName)
      );
    });

    if (feature) {
      const centroid = geoCentroid(feature);
      const projected = projection(centroid);
      return projected && projected[0] !== 0
        ? (projected as [number, number])
        : null;
    }

    return null;
  };

  const topThree = useMemo(() => popularityData.slice(0, 3), [popularityData]);

  const placements = useMemo(() => {
    if (isLoading || !geoData) return [];

    if (
      hasSearched &&
      !isLoading &&
      popularityData.length === 0 &&
      !originData
    ) {
      const msg =
        "We've searched the global scrolls, but this name remains a mystery to our maps.";
      const w = 320;
      const h = 100;
      return [
        {
          id: "fallback",
          data: { message: msg },
          box: {
            x1: WIDTH / 2 - w / 2,
            y1: HEIGHT / 2 - h / 2,
            x2: WIDTH / 2 + w / 2,
            y2: HEIGHT / 2 + h / 2,
          },
          width: w,
          height: h,
          hasLine: false,
        },
      ];
    }

    const placedLegends: LegendPlacement[] = [];
    const stdW = 140;
    const stdH = 80;

    const itemsToPlace: Array<{
      data: any;
      rank?: number;
      isOrigin?: boolean;
    }> = [];
    const normOriginName = originData
      ? normalizeCountry(originData.country_name)
      : null;
    let originMerged = false;

    topThree.forEach((pop, i) => {
      if (
        normOriginName &&
        normalizeCountry(pop.country_name) === normOriginName
      ) {
        originMerged = true;
        itemsToPlace.push({
          data: { ...pop, ...originData },
          rank: i + 1,
          isOrigin: true,
        });
      } else {
        itemsToPlace.push({ data: pop, rank: i + 1, isOrigin: false });
      }
    });

    if (!originMerged && originData) {
      itemsToPlace.push({ data: originData, isOrigin: true });
    }

    itemsToPlace.forEach((item, idx) => {
      const centroid = getCountryCentroid(item.data.country_name);
      const isMissingGeom = centroid === null;

      // Default directions for placement

      const OFFSET_SCALE = projection.scale() / 110;

  const directions = isMissingGeom
  ? [[
      MARGIN,
      HEIGHT - stdH - MARGIN - idx * (stdH + 10)
    ]]
  : [
      [50 * OFFSET_SCALE, -110 * OFFSET_SCALE],
      [-190 * OFFSET_SCALE, -110 * OFFSET_SCALE],
      [50 * OFFSET_SCALE, 40 * OFFSET_SCALE],
      [-190 * OFFSET_SCALE, 40 * OFFSET_SCALE],
      [120 * OFFSET_SCALE, -60 * OFFSET_SCALE],
      [-260 * OFFSET_SCALE, -60 * OFFSET_SCALE],
      [0, -150 * OFFSET_SCALE],
      [0, 110 * OFFSET_SCALE],
    ];


      for (const dir of directions) {
        const x = isMissingGeom ? dir[0] : centroid[0] + dir[0];
        const y = isMissingGeom ? dir[1] : centroid[1] + dir[1];
        const box = { x1: x, y1: y, x2: x + stdW, y2: y + stdH };

        // Boundary check
        if (
          box.x1 < MARGIN ||
          box.y1 < MARGIN ||
          box.x2 > WIDTH - MARGIN ||
          box.y2 > HEIGHT - MARGIN
        )
          continue;

        // Collision check with other legends
        const collides = placedLegends.some((other) => {
          const padding = 10;
          return !(
            box.x2 + padding < other.box.x1 ||
            box.x1 - padding > other.box.x2 ||
            box.y2 + padding < other.box.y1 ||
            box.y1 - padding > other.box.y2
          );
        });

        if (!collides) {
          placedLegends.push({
            id: `leg-${idx}`,
            data: item.data,
            centroid: centroid || undefined,
            box,
            width: stdW,
            height: stdH,
            rank: item.rank,
            isOrigin: item.isOrigin,
            hasLine: !isMissingGeom,
          });
          break;
        }
      }
    });

    return placedLegends;
  }, [isLoading, geoData, popularityData, originData, projection, hasSearched]);

  const getAnchorPoint = (
    centroid: [number, number],
    box: { x1: number; y1: number; x2: number; y2: number }
  ): [number, number] => {
    const cx = Math.max(box.x1, Math.min(centroid[0], box.x2));
    const cy = Math.max(box.y1, Math.min(centroid[1], box.y2));
    return [cx, cy];
  };

  return (
    <div className="relative w-full h-full ">
      <div className=" relative w-full aspect-[2/1] border-4 border-[#5d4037] bg-[#d9c5a0] shadow-2xl overflow-hidden antique-texture">
        <div className="absolute inset-0 border-2 border-[#5d4037] m-1 pointer-events-none z-10"></div>
        <MapLegend />

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 110,
            center: [0, 40],
          }}

          // projection="geoEqualEarth"
          // projectionConfig={{
          //   scale: 190,
          //   center: [0, 0],
          // }}
          width={WIDTH}
          height={HEIGHT}
          className="w-full h-full "
        >

          
          {/* Fix: Added required 'id' property to Sphere component */}
          <Sphere
            id="rsm-sphere"
            stroke="#5d4037"
            strokeWidth={0.5}
            fill="#f4e4bc"
          />
          <Graticule stroke="#5d4037" strokeWidth={0.2} opacity={0.3} />

          <Geographies geography={geoData}>
            {({ geographies }) => (
              <>
                {geographies
                  .filter((geo) => {
                    // if (normalizeCountry(geo.properties.name) === "pakistan") {
                    //   return false;
                    // }
                    // if (normalizeCountry(geo.properties.name) === "china") {
                    //   return false;
                    // }

                    // if (normalizeCountry(geo.properties.name) === "bangladesh") {
                    //   return false;
                    // }
                    // if (normalizeCountry(geo.properties.name) === "united states of america") {
                    //   return false;
                    // }
                    if (normalizeCountry(geo.properties.name) === "india") {
                      return false;
                    }

                    return true;
                  })
                  .map((geo) => {
                    const norm = normalizeCountry(geo.properties.name);
                    const isPop = popularityData.some(
                      (p) => normalizeCountry(p.country_name) === norm
                    );
                    const isOrigin =
                      originData &&
                      normalizeCountry(originData.country_name) === norm;
                    const isTopThree = topThree.some(
                      (t) => normalizeCountry(t.country_name) === norm
                    );

                    let fill = THEME.land;
                    if (isOrigin) fill = THEME.highlightOrigin;
                    else if (isTopThree) fill = THEME.highlight;
                    else if (isPop) fill = THEME.highlightSecondary;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={THEME.border}
                        strokeWidth={0.2}
                        className="land-stroke transition-colors duration-700 outline-none"
                      />
                    );
                  })}
              </>
            )}
          </Geographies>

          {indiaGeoData && (
            <Geographies geography={indiaGeoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const norm = "india";

                  const isPop = popularityData.some(
                    (p) => normalizeCountry(p.country_name) === norm
                  );

                  const isOrigin =
                    originData &&
                    normalizeCountry(originData.country_name) === norm;

                  const isTopThree = topThree.some(
                    (t) => normalizeCountry(t.country_name) === norm
                  );

                  let fill = THEME.land;
                  if (isOrigin) fill = THEME.highlightOrigin;
                  else if (isTopThree) fill = THEME.highlight;
                  else if (isPop) fill = THEME.highlightSecondary;

                  return (
                    <Geography
                      key={`india-${geo.rsmKey}`}
                      geography={geo}
                      fill={fill}
                      // fill="#ff7722"
                      stroke={THEME.border}
                      strokeWidth={0.2}
                      className="land-stroke transition-colors duration-700 outline-none"
                    />
                  );
                })
              }
            </Geographies>
          )}

          {placements.map(
            (p) =>
              p.hasLine &&
              p.centroid && (
                <line
                  key={`line-${p.id}`}
                  x1={p.centroid[0]}
                  y1={p.centroid[1]}
                  x2={getAnchorPoint(p.centroid, p.box)[0]}
                  y2={getAnchorPoint(p.centroid, p.box)[1]}
                  stroke={p.isOrigin ? THEME.highlightOrigin : THEME.border}
                  strokeWidth={1.5}
                  strokeDasharray="1, 1"
                  opacity={0.8}
                />
              )
          )}

          {placements.map((p) => (
            <foreignObject
              key={`legend-wrap-${p.id}`}
              x={p.box.x1}
              y={p.box.y1}
              width={p.width}
              height={p.height}
              style={{ overflow: "visible" }}
            >
              <LegendOverlay
                data={p.data}
                rank={p.rank}
                isOrigin={p.isOrigin}
              />
            </foreignObject>
          ))}

          {/* <Marker coordinates={[-160, -45]}>
            <g opacity="0.4" transform="scale(0.5)">
              <circle r="40" fill="none" stroke="#5d4037" strokeWidth="1" />
              <path
                d="M0,-50 L0,50 M-50,0 L50,0"
                stroke="#5d4037"
                strokeWidth="1"
              />
              <text
                y="-55"
                textAnchor="middle"
                className=" fill-[#5d4037] font-bold"
              >
                N
              </text>
            </g>
          </Marker> */}
        </ComposableMap>

        {isLoading && (
          <div className="absolute inset-0 bg-[#f4e4bc]/40 backdrop-blur-[1px] flex items-center justify-center z-20">
            <div className="bg-[#f4e4bc] border-2 border-[#5d4037] p-8 text-[#5d4037] flex flex-col items-center shadow-2xl">
              <div className="animate-spin h-12 w-12 border-4 border-[#8a3b2e] border-t-transparent rounded-full mb-4"></div>
              <p
                className="font-bold tracking-widest uppercase text-base"
                style={{ fontFamily: "'IM Fell English SC', serif" }}
              >
                Analyzing Archives
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
