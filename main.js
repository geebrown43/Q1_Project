var el = document.getElementById('form')
el.addEventListener('submit', (event) => {
    event.preventDefault();
    var id = event.target.elements.address_input.value;
    console.log(id)
    var key = 'AIzaSyDydF9_qyXVTdAs8G7IFUJngvSu1Ic7kSY'
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${id}&key=${key}`)
        .then((response) => {
            return response.json()
                .then((data) => {
                    var lat = data.results[0].geometry.location.lat
                    var lng = data.results[0].geometry.location.lng
                    console.log(lng)

                    mapboxgl.accessToken =
                        'pk.eyJ1IjoiZ2VlYnJvd240MyIsImEiOiJjajU5MTIxYmowMzV4MnhxcDlpeGN5cHg5In0.Y1nYL-rtvgEwS3qV0YkMrQ';
                    var map = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
                        zoom: 14,
                        //longitude first, then latitude
                        center: [lng, lat],
                    });


                })
        })
})