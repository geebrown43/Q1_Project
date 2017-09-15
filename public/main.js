var el = document.getElementById('form')
var key = 'AIzaSyDydF9_qyXVTdAs8G7IFUJngvSu1Ic7kSY'
var key2 = 'pk.eyJ1IjoiZ2VlYnJvd240MyIsImEiOiJjajdjNmIxeW0wMDFsMzJsajU3dzZ5MWI4In0.tGem2f5RtywDzdhUItDeCQ'
//galvanize coordinates  lat 39.7576305, lng -105.0070158
var currentLoc = []
var id = ""
var count = 0
el.addEventListener('submit', (event) => {
    event.preventDefault();
    id = event.target.elements.address_input.value;
   
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
                                    // var arrofName = [];
                                    // var arrofLat = [];
                                    // var arrofLng = [];
                                    // var arrofAddress = [];
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
                                        

                                        var storeAddress = places.results[i].vicinity
                                        var h3 = document.createElement('h3')
                                        h3.className = 'address'
                                        h3.innerText = 'Address: ' + storeAddress;
                                        div.appendChild(h3)
                                        

                                        var storeLat = places.results[i].geometry.location.lat
                                        

                                        var storeLng = places.results[i].geometry.location.lng
                                        
                                        main_content.append(div)



                                        a.setAttribute('data-lat', storeLat)
                                        a.setAttribute('data-lng', storeLng)


                                        a.addEventListener('click', (event) => {
                                            event.preventDefault();
                                            var linkId = event.target
                                            
                                                // newId.push(linkId)
                                            flyToStore(linkId)
                                            directionsAPI(linkId)
                                            
                                            console.log('link id is the element of the store with lat/long attributes')

                                        })
                                    }



                                })
                        })
                })
        })
        currentLoc.shift()
        currentLoc.shift()
    return el.reset()
}

var newid = []
callMap = () => {
    
    mapboxgl.accessToken =
        'pk.eyJ1IjoiZ2VlYnJvd240MyIsImEiOiJjajU5MTIxYmowMzV4MnhxcDlpeGN5cHg5In0.Y1nYL-rtvgEwS3qV0YkMrQ';
        // console.log(currentLoc)
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/geebrown43/cj7gp6s083y6m2stagjnq139j',
        zoom: 13,
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
        var previousLayerId = ''
        var previousStartId = ''
        var previousEndId = ''
        var end = [a.dataset.lng, a.dataset.lat]
        fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${currentLoc[0]},${currentLoc[1]};${a.dataset.lng},${a.dataset.lat}?steps=true&geometries=geojson&access_token=${key2}`)
            .then((response) => {
                return response.json()
                    .then((data) => {
                        //data.innerHTML = " "
                        console.log(data)
                        //US Mile = m * 0.00053996
                        //console.log(end)
                        var route = data.routes[0].geometry;
                        previousLayerId = 'route' + count.toString()              
                        map.setLayoutProperty(previousLayerId , 'visibility', 'none')

                        previousStartId ='start' + count.toString()              
                        map.setLayoutProperty(previousStartId, 'visibility', 'none')

                        previousEndId = 'end' + count.toString()
                        map.setLayoutProperty(previousEndId, 'visibility', 'none')
                        count++
                        map.addLayer({
                            id: "route" + count.toString(),
                            type: 'line',
                            source: {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: route
                                }
                            },
                            paint: {
                                'line-width': 5
                            }
                        })
                        map.addLayer({
                            id: 'start' + count.toString(),
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
                            id: 'end' + count.toString(),
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
    
                        // var directions = document.getElementById('directions');

                        // var steps = data.routes[0].legs[0].steps;
                        // console.log(steps)
                        // steps.forEach(function (step) {
                        //     directions.insertAdjacentHTML('beforeend', '<p>' + step.maneuver.instruction + '</p>');
                            
                        // })
                        var distance = data.routes
                        console.log(distance[0].distance)
                        for(var i = 0; i < distance.length; i++){
                            var p = document.createElement('p')
                            var content = document.getElementsByClassName('para_content')[0]
                            content.innerHTML = ''
                                p.innerText='Distance Away ' + parseInt(distance[0].distance * 0.00053996) + ' mi'
                                content.append(p)
                                
                                }
                                
                            
    
                             

                        
                        
                             //* 0.00053996
                    });

            })
        
    }
}