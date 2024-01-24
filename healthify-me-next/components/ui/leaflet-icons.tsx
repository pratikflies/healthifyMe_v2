import L from "leaflet";

const userIcon = new L.Icon({
    iconUrl: "/user.png",
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [1, -50],
    // iconSize  iconAnchor
    // x         x/2
    // y          y
});
  
const runningIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/6266/6266049.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [1, -46],
});
  
const cyclingIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/3600/3600996.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [1, -46],
});

export { userIcon, runningIcon, cyclingIcon };