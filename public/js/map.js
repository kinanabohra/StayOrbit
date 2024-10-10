var map = L.map('map');

var address = listingAddress;
console.log(address)
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
    .then(response => response.json())
    .then(data => {
        var lat = data[0].lat;
        var lon = data[0].lon;

        map.setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // var customIcon = L.icon({
        //     iconUrl: './logo.png',  
        //     iconSize: [38, 45],            
        //     iconAnchor: [19, 45],         
        //     popupAnchor: [0, -45]       
        // });

        var marker = L.marker([lat, lon]).addTo(map);

        marker.bindPopup(`<h6> <b>${address.toUpperCase()}</b></h6>Exact Location Provied After Booking`).openPopup();
    })
    .catch(error => {
        console.error('Error fetching geocoding data:', error);
    });