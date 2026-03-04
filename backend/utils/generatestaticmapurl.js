export const generateStaticMapUrl = (startLat, startLng, endLat, endLng) => {
  return `https://staticmap.openstreetmap.de/staticmap.php?size=800x500
  &markers=${startLat},${startLng},red-pushpin
  &markers=${endLat},${endLng},blue-pushpin`;
};