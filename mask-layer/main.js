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









//A distinct className is required to use another canvas for the background

const key = "8H3vz4wO6mZAX9q3EEdG"

const background =new TileLayer({   
  className: 'ol-layer-imagery',
  source: new XYZ({
    //attributions:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ',
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    //maxZoom: 20,
    //crossOrigin: '',
  }),
});

  const geoVector = new VectorLayer({     // to clip layer
    style: null,
    source: new VectorSource({
      url: 'http://localhost:8081/geoserver/local/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=local%3ATaluka&maxFeatures=50&outputFormat=application%2Fjson',
      format: new GeoJSON(),
      crossOrigin: 'anonymous'
    }),
  });


//http://localhost:8081/geoserver/local/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=local%3ATaluka&maxFeatures=50&outputFormat=application%2Fjson


// const background = new TileLayer({
//   className: 'stamen',
//   source: new Stamen({
//     layer: 'toner',
//   }),
// });

// geojson layer service from local server



const base = new TileLayer({
  source: new OSM(),
});

const clipLayer = new VectorLayer({     // to clip layer
  style: null,
  source: new VectorSource({
    url: './data/map.geojson',
    format: new GeoJSON(),
  }),
});

//Giving the clipped layer an extent is necessary to avoid rendering when the feature is outside the viewport
clipLayer.getSource().on('addfeature', function () {
  background.setExtent(clipLayer.getSource().getExtent());   //
});


const style = new Style({
  fill: new Fill({
    color: 'black',
  }),
});


background.on('postrender', function (e) {
  const vectorContext = getVectorContext(e);
  e.context.globalCompositeOperation = 'destination-in';
  clipLayer.getSource().forEachFeature(function (feature) {
    vectorContext.drawFeature(feature, style);
  });
  e.context.globalCompositeOperation = 'source-over';
});


const map = new Map({
  layers: [base, geoVector, background, clipLayer], //background,  
  target: 'map',
  view: new View({
    center: fromLonLat([75.4924070208232, 19.631953861800696]),
    zoom: 7,
  }),
});



map.on('click', function(evt){
  var lonlat = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
  console.log(lonlat)
  var lon = lonlat[0];
  var lat = lonlat[1];
  //alert("You clicked near lat lon: "+ lon.toFixed(6) + "  " + lat.toFixed(6));  // 831564965234.545288, 16.441194
});