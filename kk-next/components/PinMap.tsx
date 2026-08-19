'use client';

// OSM(Leaflet) 핀 지도 — 클릭/드래그로 배달 위치 지정 + 모바일 전체화면 확대
// SSR 불가: 반드시 next/dynamic({ ssr: false })로 불러올 것.
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// 번들러에서 기본 마커 경로가 깨지므로 명시 지정
const markerIcon = L.icon({
  iconUrl: iconUrl.src, iconRetinaUrl: iconRetinaUrl.src, shadowUrl: shadowUrl.src,
  iconSize: [25, 41], iconAnchor: [12, 41], shadowSize: [41, 41],
});

// 기본 중심: 울란바토르
const UB: [number, number] = [47.9188, 106.9176];

function ClickPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

// 드로어/모달 안에서 타일이 회색으로 뜨는 것 방지 + 핀 위치로 이동
function FitView({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 80);
    return () => clearTimeout(t);
  }, [map]);
  useEffect(() => {
    if (lat != null && lng != null) map.setView([lat, lng], Math.max(map.getZoom(), 14));
  }, [map, lat, lng]);
  return null;
}

interface PinMapProps {
  lat: number | null | undefined;
  lng: number | null | undefined;
  /** 지정 시 편집 모드 — 클릭/드래그로 좌표 변경 */
  onChange?: (lat: number, lng: number) => void;
  height?: number;
  /** 전체화면 확대 버튼 표시 (모바일) */
  expandable?: boolean;
}

export function PinMap({ lat, lng, onChange, height = 200, expandable = false }: PinMapProps) {
  const [full, setFull] = useState(false);
  const pos: [number, number] | null = lat != null && lng != null ? [lat, lng] : null;

  const map = (
    <MapContainer key={full ? 'full' : 'inline'} center={pos ?? UB} zoom={pos ? 14 : 12}
      style={{ height: '100%', width: '100%' }} scrollWheelZoom>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FitView lat={lat ?? null} lng={lng ?? null} />
      {onChange && <ClickPicker onPick={onChange} />}
      {pos && (
        <Marker position={pos} icon={markerIcon} draggable={!!onChange}
          eventHandlers={onChange ? {
            dragend: (e) => { const p = (e.target as L.Marker).getLatLng(); onChange(p.lat, p.lng); },
          } : undefined} />
      )}
    </MapContainer>
  );

  const hint = onChange && !pos && (
    <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(14,27,46,.88)', color: '#EFECE3', fontSize: 12, padding: '6px 13px', borderRadius: 8, pointerEvents: 'none', zIndex: 500, whiteSpace: 'nowrap' }}>
      Газрын зураг дээр дарж байршил сонгоно уу
    </div>
  );

  if (full) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'var(--ink)' }}>
        {map}
        {hint}
        <button type="button" onClick={() => setFull(false)}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 500, width: 40, height: 40, borderRadius: 10, border: 0, background: 'rgba(14,27,46,.92)', color: '#EFECE3', fontSize: 17, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,.4)' }}>
          ✕
        </button>
        <button type="button" onClick={() => setFull(false)}
          style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 500, padding: '13px 30px', borderRadius: 11, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 14.5, cursor: 'pointer', boxShadow: '0 6px 22px rgba(0,0,0,.45)' }}>
          {pos ? '✓ Байршил сонгосон' : 'Хаах'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', zIndex: 0 }}>
      {map}
      {hint}
      {expandable && (
        <button type="button" onClick={() => setFull(true)} title="Томруулах"
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 500, width: 34, height: 34, borderRadius: 8, border: 0, background: 'rgba(14,27,46,.88)', color: '#EFECE3', fontSize: 15, cursor: 'pointer' }}>
          ⛶
        </button>
      )}
    </div>
  );
}
