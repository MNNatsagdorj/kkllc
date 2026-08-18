import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Vite 번들에서 기본 마커 아이콘 경로가 깨지므로 명시 지정
const markerIcon = L.icon({
  iconUrl, iconRetinaUrl, shadowUrl,
  iconSize: [25, 41], iconAnchor: [12, 41], shadowSize: [41, 41],
})

// 기본 중심: 울란바토르
const UB: [number, number] = [47.9188, 106.9176]

function ClickPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) })
  return null
}

// 모달 안에서는 레이아웃 확정 전에 타일이 계산되어 회색으로 뜨므로 invalidateSize 필요
function FitView({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 60)
    return () => clearTimeout(t)
  }, [map])
  useEffect(() => {
    if (lat != null && lng != null) map.setView([lat, lng], Math.max(map.getZoom(), 14))
  }, [map, lat, lng])
  return null
}

interface PinMapProps {
  lat: number | null | undefined
  lng: number | null | undefined
  /** 지정 시 편집 모드 — 지도 클릭/핀 드래그로 좌표 변경 */
  onChange?: (lat: number, lng: number) => void
  height?: number
}

export function PinMap({ lat, lng, onChange, height = 220 }: PinMapProps) {
  const pos: [number, number] | null = lat != null && lng != null ? [lat, lng] : null
  return (
    <div style={{ height, borderRadius: 11, overflow: 'hidden', border: '1px solid #ececef', position: 'relative', zIndex: 0 }}>
      <MapContainer center={pos ?? UB} zoom={pos ? 14 : 12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitView lat={lat ?? null} lng={lng ?? null} />
        {onChange && <ClickPicker onPick={onChange} />}
        {pos && (
          <Marker
            position={pos}
            icon={markerIcon}
            draggable={!!onChange}
            eventHandlers={onChange ? { dragend: (e) => { const p = (e.target as L.Marker).getLatLng(); onChange(p.lat, p.lng) } } : undefined}
          />
        )}
      </MapContainer>
      {onChange && !pos && (
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(24,24,27,.82)', color: '#fff', fontSize: 12, padding: '5px 12px', borderRadius: 8, pointerEvents: 'none', zIndex: 500, whiteSpace: 'nowrap' }}>
          Газрын зураг дээр дарж байршил сонгоно уу
        </div>
      )}
    </div>
  )
}
