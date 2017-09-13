var el = document.getElementById('form')
var key = 'AIzaSyDydF9_qyXVTdAs8G7IFUJngvSu1Ic7kSY'
var key2 = 'pk.eyJ1IjoiZ2VlYnJvd240MyIsImEiOiJjajdjNmIxeW0wMDFsMzJsajU3dzZ5MWI4In0.tGem2f5RtywDzdhUItDeCQ'
//galvanize coordinates  lat 39.7576305, lng -105.0070158
var currentLoc = []
el.addEventListener('submit', (event) => {
    event.preventDefault();
    var id = event.target.elements.address_input.value;
    //console.log(id)
    getData(id)
})

getData = (id) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${id}&key=${key}`)
        .then((response) => {
            return response.json()
                .then((data) => {
                    var lat = data.results[0].geometry.location.lat
                    var lng = data.results[0].geometry.location.lng
                    currentLoc.push(lng)
                    currentLoc.push(lat)
                    callMap()
                    // 20miles = 32186.9 meters
                    fetch(`https://galvanize-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=32186.9&type=shoe_store&key=${key}`)
                        .then((response) => {
                            return response.json()
                                .then((places) => {
                                    //Used to view full properties 
                                    //console.log(places)
                                    var arrofName = [];
                                    var arrofLat = [];
                                    var arrofLng = [];
                                    var arrofAddress = [];
                                    var main_content = document.getElementsByClassName('main_content')[0]
                                    main_content.innerHTML = ''

                                    for (var i = 0; i < places.results.length; i++) {
                                        var div = document.createElement('div')
                                        div.className = 'store_info'
                                        var storeName = places.results[i].name
                                        var a = document.createElement('a')
                                        a.className = 'name'
                                        a.innerText = storeName;
                                        div.appendChild(a)
                                        arrofName.push(storeName)

                                        var storeAddress = places.results[i].vicinity
                                        var h3 = document.createElement('h3')
                                        h3.className = 'address'
                                        h3.innerText = 'Address: ' + storeAddress;
                                        div.appendChild(h3)
                                        arrofAddress.push(storeAddress)

                                        var storeLat = places.results[i].geometry.location.lat
                                        arrofLat.push(storeLat)

                                        var storeLng = places.results[i].geometry.location.lng
                                        arrofLng.push(storeLng)
                                        main_content.append(div)


                                        a.setAttribute('data-lat', storeLat)
                                        a.setAttribute('data-lng', storeLng)


                                        a.addEventListener('click', (event) => {
                                            event.preventDefault();
                                            var id = event.target
                                                newid.push(id)
                                            flyToStore(id)
                                            directionsAPI(id)
                                        
                                            

                                        })
                                    }



                                })
                        })
                })
        })
    return el.reset()
}
var newid = []
callMap = () => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiZ2VlYnJvd240MyIsImEiOiJjajU5MTIxYmowMzV4MnhxcDlpeGN5cHg5In0.Y1nYL-rtvgEwS3qV0YkMrQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/geebrown43/cj7gp6s083y6m2stagjnq139j',
        zoom: 10,
        //longitude first, then latitude
        center: [currentLoc[0], currentLoc[1]],
    });

    flyToStore = (a) => {
        map.flyTo({
            center: [a.dataset.lng, a.dataset.lat],
            zoom: 15
        });

    }

    directionsAPI = (a) => {
        var end = [a.dataset.lng, a.dataset.lat]
        fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${currentLoc[0]},${currentLoc[1]};${a.dataset.lng},${a.dataset.lat}?steps=true&geometries=geojson&access_token=${key2}`)
            .then((response) => {
                return response.json()
                    .then((data) => {
                        console.log(data)
                        var route = data.routes[0].geometry;
                        map.addLayer({
                            id: 'route',
                            type: 'line',
                            source: {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: route
                                }
                            },
                            paint: {
                                'line-width': 3
                            }
                        })
                        map.addLayer({
                            id: 'start',
                            type: 'circle',
                            source: {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: currentLoc
                                    }
                                }
                            }
                        });
                        map.addLayer({
                            id: 'end',
                            type: 'circle',
                            source: {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: end
                                    }
                                }
                            }

                        });
                        var instructions = document.getElementById('instructions');
                        var steps = data.routes[0].legs[0].steps;
                        steps.forEach(function (step) {
                            instructions.insertAdjacentHTML('beforeend', '<p>' + step.maneuver.instruction + '</p>');
                        })

                    });

            })
        
    }
}