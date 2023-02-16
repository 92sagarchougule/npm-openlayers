import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

const layers = [
  new TileLayer({
    source: new OSM(),
  }),
  new TileLayer({
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/mit/wms',
      params: {'LAYERS': 'mit:Data', 'TILED': true},
      serverType: 'geoserver',
      // Countries have transparency, so do not fade tiles:
      transition: 0,
    }),
  }),
];
const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [8431573.345809242, 2211766.0496435007],
    zoom: 7,
  }),
});
 
map.on('click', function(evt) {
  console.log(evt.coordinate);
})


 
  // convert coordinate to EPSG-4326
  //console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));


