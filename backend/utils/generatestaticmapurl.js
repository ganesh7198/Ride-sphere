export const generateStaticMapUrl = (startLat, startLng, endLat, endLng) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=800x500&markers=color:red|${startLat},${startLng}&markers=color:blue|${endLat},${endLng}`;
};