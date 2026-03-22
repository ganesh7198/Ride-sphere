export const generateStaticMapUrl = (startLat, startLng, endLat, endLng) => {
  return `https://staticmap.openstreetmap.de/staticmap.php?size=600x300&markers=${startLat},${startLng},green|${endLat},${endLng},red&path=${startLat},${startLng}|${endLat},${endLng}`;
};