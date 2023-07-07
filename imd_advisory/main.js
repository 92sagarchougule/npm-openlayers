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
import ZoomSlider from 'ol/control/ZoomSlider';
import { Stroke } from 'ol/style.js';









// const wmsSource = new TileWMS({
//   url: 'https://ahocevar.com/geoserver/wms',
//   params: {'LAYERS': 'ne:ne', 'TILED': true},
//   serverType: 'geoserver',
//   crossOrigin: 'anonymous',
// });




//A distinct className is required to use another canvas for the background

const key = "8H3vz4wO6mZAX9q3EEdG"

const background =new TileLayer({   
  className: 'ol-layer-imagery',
  source: new XYZ({
    //attributions:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ',
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    
  }),
});

            
              //http://20.219.130.223:8080/geoserver/weather_services/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=District&outputFormat=application/json


  var url = "http://20.219.130.223:8080/geoserver/weather_services/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=District&outputFormat=application/json";

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
    // }),



  });







// const districtLayer = new TileLayer({
//   //extent: [-13884991, 2870341, -7455066, 6338219],
//   source: new TileWMS({
//     url: 'http://20.219.130.223:8080/geoserver/vector/wms',
//     params: {'LAYERS': '	vector:District', 'TILED': true},
//     serverType: 'geoserver',
//     crossOrigin: 'anonymous',
//     // Countries have transparency, so do not fade tiles:
//     transition: 0,
//   }),
// })

const base = new TileLayer({
  source: new OSM(),
});

const map = new Map({
  layers: [base], //background,  geoVector potentialLayer, base, , potentialLayer, districtLayer
  target: 'map',
  view: new View({
    center: fromLonLat([76.40872909324703, 18.892120644156023]),
    zoom: 7.4,
  }),
});






const mPos = new MousePosition({
  className : 'ol-mouse-position',
  //coordinateFormat: function (coordinate) {},
  //placeholder:'down-left'
});

    



map.addControl(new ScaleLine());
map.addControl(new Zoom());
//map.addControl(new ZoomSlider());
map.addControl(mPos);
map.addLayer(geojson);

map.on('click', function(event) {
  // Get the clicked coordinate
  var clickedCoordinate = event.coordinate;

  // Get the features at the clicked coordinate
  var features = map.getFeaturesAtPixel(event.pixel);

  // If features are found at the clicked coordinate
  if (features && features.length > 0) {
    // Get the properties of the first feature
    var properties = features[0].getProperties();


    document.getElementById("District").innerHTML = properties.dist_code;

    
    //alert('District Code : ' + properties.dist_code + ' | ' +' District Name : ' +properties.dist_name);

    // var requestOptions = {
    //   method: 'GET',
    //   redirect: 'follow'
    // };
    // const imd_Data = fetch("http://uatapi_mat.mahaitgov.in/district_advisory_data/"+ properties.dist_code , requestOptions)
    //   .then(response => response.json())
    //   .then(result => result)
    //   .catch(error => console.log('error', error));
    // const apiData = imd_Data;
    //console.log(imd_Data); 

    const url = "http://uatapi_mat.mahaitgov.in/district_advisory_data/"+ properties.dist_code

      var req_imd_Data = new XMLHttpRequest();
      req_imd_Data.overrideMimeType("application/json");
      req_imd_Data.open('GET', url, true);
      req_imd_Data.onload  = function() {
        var jsonResponse = JSON.parse(req_imd_Data.responseText);
        // do something with jsonResponse
        console.log(jsonResponse);

        //var tbl_Window = window.open("", "", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=50,width=600,height=600");
        //tbl_Window.document.write("<h2 style='color:green'><p> IMD Crop Advisory of  " + properties.dist_name + ''+ ' District</p></h2>');
        //tbl_Window.document.write("<h2 style='color:green'><p> IMD Crop Advisory of  " + properties.dist_name + ''+ ' District</p></h2>');

        //Date :   jsonResponse[0].custom_date
        // No of crops : jsonResponse.length
        // Crop Name : jsonResponse[0].crop_name

        forEach(jsonResponse)





        
      };
      req_imd_Data.send(null);

      



  }
  // else{
  //   document.getElementById("District").innerHTML = 'Please click inside of Maharashtra state boundary';
  // }


 
  

});