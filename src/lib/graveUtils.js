
export function hasCoordinates(grave) {
  return grave?.lat !== null
    && grave?.lng !== null
    && grave?.lat !== undefined
    && grave?.lng !== undefined
    && !Number.isNaN(Number(grave.lat))
    && !Number.isNaN(Number(grave.lng));
}

export function getGoogleMapsDirectionsUrl(grave) {
  if (grave.googleMapsUrl) return grave.googleMapsUrl;
  if (!hasCoordinates(grave)) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${grave.lat},${grave.lng}`;
}

export function getGraveSlug(grave) {
  return grave.id || grave.personId || encodeURIComponent(grave.name || 'grave');
}

export function getGraveUrl(grave) {
  return `${window.location.origin}${window.location.pathname}#grave-${getGraveSlug(grave)}`;
}

export function getPersonGraveUrl(grave) {
  return `${window.location.origin}${window.location.pathname}#person-${grave.personId || getGraveSlug(grave)}`;
}

export function normalizeGrave(grave, index) {
  return {
    ...grave,
    id: grave.id || grave.personId || `grave-${index + 1}`,
  };
}

export function mapMarkerPosition(grave, bounds) {
  if (!hasCoordinates(grave) || !bounds) return null;

  const lat = Number(grave.lat);
  const lng = Number(grave.lng);

  const xRange = bounds.maxLng - bounds.minLng || 1;
  const yRange = bounds.maxLat - bounds.minLat || 1;

  const x = ((lng - bounds.minLng) / xRange) * 82 + 9;
  const y = (1 - ((lat - bounds.minLat) / yRange)) * 72 + 14;

  return {
    left: `${Math.max(4, Math.min(96, x))}%`,
    top: `${Math.max(4, Math.min(96, y))}%`,
  };
}

export function getBounds(graves) {
  const withCoordinates = graves.filter(hasCoordinates);
  if (!withCoordinates.length) return null;

  const lats = withCoordinates.map((grave) => Number(grave.lat));
  const lngs = withCoordinates.map((grave) => Number(grave.lng));

  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);

  // Khoảng đệm tự nhiên ~200-300m để các mộ phần kề nhau hiển thị cân đối
  const minPadding = 0.003;
  const latDelta = maxLat - minLat;
  const lngDelta = maxLng - minLng;

  if (latDelta < minPadding) {
    const pad = (minPadding - latDelta) / 2;
    minLat -= pad;
    maxLat += pad;
  }
  if (lngDelta < minPadding) {
    const pad = (minPadding - lngDelta) / 2;
    minLng -= pad;
    maxLng += pad;
  }

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
  };
}
