const socket = io();
const markers = {}; // Store markers for all users

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (err) => {
            console.error("Geolocation error:", err);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}

// Initialize Map
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

// 🔥 Fix: Store markers for multiple users and update them correctly
socket.on("receive-location", (users) => {
    Object.keys(users).forEach((id) => {
        const { latitude, longitude } = users[id];

        if (markers[id]) {
            // Update existing marker position
            markers[id].setLatLng([latitude, longitude]);
        } else {
            // Create a new marker for a new user
            markers[id] = L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(`User: ${id}`)
                .openPopup();
        }

        // If it's the current user's location, center the map on them
        if (id === socket.id) {
            map.setView([latitude, longitude], 16);
        }
    });
});

// Remove markers when users disconnect
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); // Remove marker from map
        delete markers[id]; // Remove from object
    }
});
