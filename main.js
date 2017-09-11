var el = document.getElementById('form')
var key = 'AIzaSyDydF9_qyXVTdAs8G7IFUJngvSu1Ic7kSY'
el.addEventListener('submit', (event) => {
    event.preventDefault();
    var id = event.target.elements.address_input.value;
    //console.log(id)

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${id}&key=${key}`)
        .then((response) => {
            return response.json()
                .then((data) => {
                    var lat = data.results[0].geometry.location.lat
                    var lng = data.results[0].geometry.location.lng
                    //console.log(lng)

                    mapboxgl.accessToken =
                        'pk.eyJ1IjoiZ2VlYnJvd240MyIsImEiOiJjajU5MTIxYmowMzV4MnhxcDlpeGN5cHg5In0.Y1nYL-rtvgEwS3qV0YkMrQ';
                    var map = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
                        zoom: 14,
                        //longitude first, then latitude
                        center: [lng, lat],
                    });

    fetch(`https://galvanize-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&types=shoe_store&key=${key}`)
            .then((response) => {
                return response.json()
                    .then((places) => {
                        //Used to view full properties 
                         //console.log(places)  
                        var arrofName = [];
                        var arrofLat = [];
                        var arrofLng = [];
                            for (var i = 0; i < places.results.length; i++) {
                                var storeName = places.results[i].name
                                arrofName.push(storeName)
                                var storeLat = places.results[i].geometry.location.lat
                                arrofLat.push(storeLat)
                                var storeLng = places.results[i].geometry.location.lng
                                arrofLng.push(storeLng)
                                    }
                                    console.log(arrofName, arrofLat, arrofLng)

                                })
                        })
                })
        })



})