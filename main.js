//JULIEN: importing necessary modules from OpenLayers 5
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {OSM} from 'ol/source.js';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj.js';
import TileWMS from 'ol/source/TileWMS.js';
import proj4 from 'ol/proj/proj4-src.js';
import {defaults as defaultControls, ScaleLine} from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Stroke, Style} from 'ol/style.js';
import {WFS} from 'ol/format.js';
import VectorSource from 'ol/source/Vector.js';

//JULIEN: define EPSG 31370
proj4.defs("EPSG:31370","+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666" +
	" +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,0.336570,-0.456955,1.842183,-1.2747 +units=m +no_defs");
	
register(proj4);

const proj31370 = getProjection('EPSG:31370');
proj31370.setExtent([0, 0, 300000, 400000]);

//JULIEN: initialize OSM layer
var OSMlayer = new TileLayer({
	source: new OSM()
});

/*ANNELIES: all the WMS layers: GRB-basiskaart, orthofoto's Vlaanderen,
orthofoto's Wallonië, Urbis en PICC
*/
var GRBlayer = new TileLayer({
	source: new TileWMS({
            url: 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB-basiskaart/wms',
            params: {'LAYERS': 'GRB_BSK' },
			serverType: 'geoserver',
          })
	});
//ANNELIES: verwijderen van singleTile en ratio geeft hetzelfde beeld als met 
/* var GRBlayer = new TileLayer({
	source: new TileWMS({
            url: 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB-basiskaart/wms',
            params: {'LAYERS': 'GRB_BSK', 'singleTile': 'false', 'ratio': '1.2' },
			serverType: 'geoserver',
          })
	}); */
var OrthoVL = new TileLayer({
	source: new TileWMS({
            url: "http://geoservices.informatievlaanderen.be/raadpleegdiensten/omwrgbmrvl/wms",
            params: {'LAYERS': 'Ortho' },
			serverType: 'geoserver',
          })
	});
    
var OrthoWAL = new TileLayer({
	source: new TileWMS({
            url: "http://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_2016/MapServer/WmsServer",
            params: {'LAYERS': '0' },
			serverType: 'geoserver',
          })
	});
    
var Urbis = new TileLayer({
	source: new TileWMS({
            url: "http://www.gis.irisnet.be/arcgis/services/basemap/urbisNL/MapServer/WMSServer",
            params: {'LAYERS': '0' },
			serverType: 'geoserver',
          })
	});

var PICC = new TileLayer({
	source: new TileWMS({
            url: "http://geoservices.wallonie.be/arcgis/services/TOPOGRAPHIE/PICC_VDIFF/MapServer/WmsServer",
            params: {'LAYERS': '1,3,4,5,7,9,10,11,12,14,15,16,17,19,20,21,23,24,25,26,27,28,29' },
			serverType: 'geoserver',
          })
	});

// JULIEN: Bron van de WFS verklaren om later aan te vullen met fetch API
const WFSsource = new VectorSource();

// JULIEN: Effectieve WFS laag, met zelf gekozen stijl (hier blauw)
var WFSlayer = new VectorLayer({
	source: WFSsource,
	style: new Style({
		stroke: new Stroke({
		color: 'rgba(0, 0, 255, 1.0)',
		width: 2
	  })
	})
});

//Features opvragen via MapGuide aan de hand van fetch API en toevoegen aan WFSsource
fetch('http://localhost:8008/mapguide/mapagent/mapagent.fcgi?REQUEST=GETFEATURE&SERVICE=WFS&' +
		'TYPENAME=ns222480773:Refprv&VERSION=1.1.0&srsname=EPSG:31370&USERNAME=Administrator&PASSWORD=admin')
	.then((response) => {
		return response.text();
	}).then( (gml) => {
		var features = new WFS().readFeatures(gml);
		WFSsource.addFeatures(features);
	});
    
//ANNELIES: creating a scaleline
var scale = new ScaleLine();

//ANNELIES: coordinates mouse position
var mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:31370',
        className: 'custom-mouse-position',
        target: document.getElementById('coordinates'), 
        undefinedHTML: '&nbsp;'
    });

/*//////////////
/    THE MAP   /
//////////////*/

var map = new Map({
  target: 'map-container',
  layers: [
    OSMlayer,
	GRBlayer,
    //OrthoVL,
    //OrthoWAL,
    //Urbis,
    //PICC,
	WFSlayer
    ],
  view: new View({
    projection: proj31370,
	center: [171171, 147873],
	zoom: 2
    }),
  controls: [scale, mousePositionControl]
});
		
		
		