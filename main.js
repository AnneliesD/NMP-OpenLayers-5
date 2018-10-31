import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {OSM} from 'ol/source.js';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj.js';
import TileWMS from 'ol/source/TileWMS.js';
import proj4 from 'ol/proj/proj4-src.js';

proj4.defs("EPSG:31370","+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666" +
	" +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,0.336570,-0.456955,1.842183,-1.2747 +units=m +no_defs");
	
register(proj4);

const proj31370 = getProjection('EPSG:31370');
proj31370.setExtent([0, 0, 300000, 400000]);

var OSMlayer = new TileLayer({
	source: new OSM()
});

var WMSlayer = new TileLayer({
	source: new TileWMS({
            url: 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB-basiskaart/wms',
            params: {'LAYERS': 'GRB_BSK', 'singleTile': 'false', 'ratio': '1.2' },
			serverType: 'geoserver',
          })
	});

new Map({
  target: 'map-container',
  layers: [
    OSMlayer,
	WMSlayer
  ],
  view: new View({
    projection: proj31370,
	center: [171171, 147873],
	zoom: 2
  })
});