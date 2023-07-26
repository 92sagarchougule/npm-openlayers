import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {Fill, Style} from 'ol/style.js';
import {OSM, Stamen, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {fromLonLat} from 'ol/proj.js';
import {getVectorContext} from 'ol/render.js';
import XYZ from 'ol/source/XYZ.js';
import { transform } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import MousePosition from 'ol/control/MousePosition.js';
import Zoom from 'ol/control/Zoom.js';
import {defaults} from 'ol/interaction';
import Overlay from 'ol/Overlay';


document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
     document.querySelector("body").style.visibility = "hidden";
     document.getElementById("loading_indicator").style.visibility = "visible";
  } else {
     setTimeout(() => {
        document.getElementById("loading_indicator").style.display ="none";
        document.querySelector("body").style.visibility = "visible";
     }, 3000)
  }
};


// const wmsSource = new TileWMS({
//   url: 'http://20.219.130.223:8080/geoserver/vector/wms',
//   params: {'LAYERS': 'vector:District', 'TILED': true},
//   serverType: 'geoserver',
//   crossOrigin: 'anonymous',
// });

const districtLayer = new TileLayer({
  //extent: [-13884991, 2870341, -7455066, 6338219],
  source: new TileWMS({
    url: 'http://20.219.130.223:8080/geoserver/imd_advisory/wms',
    params: {'LAYERS': '	vector:District', 'TILED': true},
    serverType: 'geoserver',
    crossOrigin: 'anonymous',
    // Countries have transparency, so do not fade tiles:
    transition: 0,
  }),
})


//A distinct className is required to use another canvas for the background

// const key = "8H3vz4wO6mZAX9q3EEdG"

// const background =new TileLayer({   
//   className: 'ol-layer-imagery',
//   source: new XYZ({
//     //attributions:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ',
//     url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    
//   }),
// });

            
  //http://20.219.130.223:8080/geoserver/weather_services/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=District&outputFormat=application/json

  // ----------------- Attribute List ------------------------------------------------
  //"http://20.219.130.223:8080/geoserver/wfs?version=1.3.0&request=describeFeatureType&outputFormat=application/json&service=WFS&typeName=District"

  //


  var url = "http://20.219.130.223:8080/geoserver/imd_advisory/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&outputFormat=application/json";

const geojson = new VectorLayer({
    title: "Taluka",
    source: new VectorSource({
      url: url,
      format: new GeoJSON(),
    }),

    // style: new Style({
    //   fill: new Fill({
    //     color: 'red',
    //   }),
    //   stroke: new Stroke({
    //     color: 'white',
    //   }),
    // })
  });


  var distAttLayer = "http://20.219.130.223:8080/geoserver/wfs?version=1.3.0&request=describeFeatureType&outputFormat=application/json&service=WFS&typeName=District"

  var req_imd_Data = new XMLHttpRequest();
      req_imd_Data.overrideMimeType("application/json");
      req_imd_Data.open('GET', distAttLayer, true);
      req_imd_Data.onload  = function() {
        var jsonResponse = JSON.parse(req_imd_Data.responseText);
        // do something with jsonResponse
        //console.log(jsonResponse);


        // jsonResponse.forEachorEach(myFunction(evt){
        //   console.log(evt);
        // });

        function myFunction(item) {
          console.log(jsonResponse[item]);
        }
      };
      req_imd_Data.send(null);




const base = new TileLayer({
  source: new OSM(),
});

const map = new Map({
  layers: [base], //background,  geoVector potentialLayer, base, , potentialLayer, districtLayer
  target: 'map',
  interactions:defaults({mouseWheelZoom:false}),
  view: new View({
    center: fromLonLat([76.40872909324703, 18.892120644156023]),
    zoom: 7.1,
  }),
});






const mPos = new MousePosition({
  className : 'ol-mouse-position',
  //coordinateFormat: function (coordinate) {},
  //placeholder:'down-left'
});








//Map Onclick Function

map.on('click', function(event) {
  // Get the clicked coordinate
  var clickedCoordinate = event.coordinate;

  // Get the features at the clicked coordinate
  var features = map.getFeaturesAtPixel(event.pixel);

  // If features are found at the clicked coordinate
  if (features && features.length > 0) {
    // Get the properties of the first feature

    let properties = features[0].getProperties();

    //var name = "District : <b>" + properties.dist_name + "</b> / " + "Taluka : <b> " + properties.tah_name +"<b/>";

    let name = "<table> <tr> <th> District </th> " + "<th>Taluka</th> </tr> "+ "<tr><td><b>"+properties.dist_name + "</b></td>  "  + "<td><b>"+properties.tah_name +"</b> </td></tr> <table>";



    //document.getElementById("District").innerHTML = name;

    // ------------------------------------------- API from Database----------------------------------------------


    const url = "http://uatapi_mat.mahaitgov.in/district_advisory_data/"+ properties.tah_code ;

      var req_imd_Data = new XMLHttpRequest();
      req_imd_Data.overrideMimeType("application/json");
      req_imd_Data.open('GET', url, true);
      req_imd_Data.onload  = function() {
        var jsonResponse = JSON.parse(req_imd_Data.responseText);
        // do something with jsonResponse
        //console.log(jsonResponse);

        jsonResponse.forEach(myFunction);

        function myFunction(item) {
          //console.log(jsonResponse[item].crop_name);
        }
      };
      req_imd_Data.send(null);

      // -----------------------------------------------------------------------------------------------------------



      var content = document.getElementById('popup')

      var popup = new Overlay({
        element: content
      });

      var coor = event.coordinate

      popup.setPosition(coor);

      map.addOverlay(popup);

      
      content.innerHTML = name;

  }
  // else{
  //   document.getElementById("District").innerHTML = 'Please click inside of Maharashtra state boundary';
  // }

});

// ---------------------------------------------- Feature List --------------------------------------------------------

    // var FcLayer = "http://20.219.130.223:8080/geoserver/imd_advisory/wms?request=GetCapabilities&service=WMS&version=1.3.0";

    // var req_imd_Data = new XMLHttpRequest();
    //   req_imd_Data.overrideMimeType("application/json");
    //   req_imd_Data.open('GET', FcLayer, true);
    //   req_imd_Data.onload  = function() {
    //     var jsonResponse = JSON.parse(req_imd_Data.text);
    //     // do something with jsonResponse
    //     console.log(jsonResponse);

    //     jsonResponse.forEach(myFunction);

    //     function myFunction(item) {
    //       //console.log(jsonResponse[item].crop_name);
    //     }
    //   };
    //   req_imd_Data.send(null);







map.addLayer(geojson);
map.addLayer(districtLayer);

map.addControl(new ScaleLine());
map.addControl(new Zoom());
//map.addControl(new ZoomSlider());
map.addControl(mPos);


















