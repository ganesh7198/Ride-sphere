export const generateStaticMapUrl = (startLat, startLng, endLat, endLng) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=600x300
  &markers=color:green|${startLat},${startLng}
  &markers=color:red|${endLat},${endLng}
  &path=color:0x0000ff|weight:4|${startLat},${startLng}|${endLat},${endLng}`;
};