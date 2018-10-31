//ANNELIES: variabelen voor de map session
var mapagent;
var MapGuideConfig;
var MapGuideServer;
var MapAgentPath;
var SessionId;
var MapName;
var AppId;
var AppName;
var AppShort;
var AppTitle;
var isBeheerder;
var isDeveloper;

//ANNELIES: aanmaken van een sessie voor een bepaalde gebruiker
function initMapSession()
{
	$.get("../common/pages/createmapsession.ashx", { mapdefinition: "Library://actiekaarten/actiekaarten.MapDefinition", userid: username },
        function (data) {
        	data = $.parseJSON(data);
        	window.mapname = data.MapName;
        	window.session = data.SessionId;
        	mapagent = data.MapAgentPath;

        	MapGuideConfig = data.MapGuideConfig;
        	MapGuideServer = data.MapGuideServer;
        	MapAgentPath = data.MapAgentPath;
        	AppId = data.AppId;
        	AppName = data.AppName_2;
        	AppShort = data.AppShort;
        	AppTitle = data.AppTitle;
        	isBeheerder = data.isBeheerder;
        	isDeveloper = data.isDeveloper;

        	initMap(); //ANNELIES: initialisatie van de kaart

        }).fail(function (xhr, status, error) { alert("AJAX error: " + error + " \n" + status + " \n" + xhr.status); });
}


//initialiseert de kaart. Dit gebeurt nadat een sessie gemaakt werd en een kaartdefinitie op de server werd aangemaakt.
function initMap() 
{
	OpenLayers.DOTS_PER_INCH = 96;  //ANNELIES: vermoedelijk dpi van gehele kaart 
    var extent = new OpenLayers.Bounds(21000, 15000, 259000, 245000); //ANNELIES: bounding box met left, bottom, right en top => voor maxExtent
    //var extent = new OpenLayers.Bounds(210000, 150000, 215000, 155000);
	//var extent = new OpenLayers.Bounds(204100,196450,204200,196550);
	//var extent = new OpenLayers.Bounds(203972,196685,204403,196346);
	
	
    
    var Scales = [3870238.3104, 1935119.1552, 967559.5776, 483779.7888, 241889.8944, 120944.9472, 60472.4736, 30236.2368, 15118.1184, 7559.0592, 3779.5296, 1889.7648, 944.8824, 472.4412, 236.2206, 118.1103];
    var mapOptions = { //ANNELIES: eigenschappen van zowel Map als Layer
        units: "m",
        projection: "EPSG:31370",
        maxExtent: extent,
        scales: Scales, //ANNELIES: verschillende schalen mogelijk bij het zoomen
		controls: [] //ANNELIES: controls voor de functionaliteit van de kaart zoals pannen, zoomen, enz. 
    }; // Lege controls toegevoegd die nadien opnieuw worden aangevuld (zie onderaan deze file) (Linton)
    
    map = new OpenLayers.Map('map', mapOptions); //ANNELIES: aanmaken van de kaart met twee parameters: div in de cfm voor de kaart en opties
	
    var url = mapagent + "?SESSION=" + session; //ANNELIES: voor de MapGuide Layer
	//var layer = new OpenLayers.Layer.MapGuide("MapGuide OS tiled layer", url, params, options);
    //map.addLayer(layer);

    //ANNELIES: opties voor de MapGuide Layer
    var options = {
    	isBaseLayer: false,
    	useOverlay: true, //ANNELIES: to indicate if the layer should be retrieved using GETMAPIMAGE (default) or using GETDYNAMICOVERLAY requests
    	useAsyncOverlay: false, //ANNELIES: MapGuide specifications
    	buffer: 1, //ANNELIES: grid specificatie: extra ruimte (kolommen en rijen) rondom minimum grid
    	singleTile: true, //ANNELIES: inladen in één tegel
    	transitionEffect: 'resize' //ANNELIES: default setting 
    };
    
    //ANNELIES: extra parameters voor de MapGuide Layer
    var params = {
    	//session: session,
    	mapname: mapname, //ANNELIES: zie window
    	locale: 'nl', //ANNELIES: Locale setting (for untiled overlays layers only)
    	version: '1.2.0', //ANNELIES: nodig?
    	selectioncolor: '0xFF000000', //ANNELIES: selectiekleur
    	behavior: 7 //ANNELIES: geen idee wat dit doet 
    };
    
    //ANNELIES: aanmaken van een MapGuide layer
    dynlayer = new OpenLayers.Layer.MapGuide("Pipelines", url, params, options); //ANNELIES: naam, locatie, params, options
    map.addLayer(dynlayer);
    window.dynlayer = dynlayer;
    
    //ANNELIES: aanmaken van stijl 
    var styles = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(null, {
            rules: [
                new OpenLayers.Rule({
                    symbolizer: {
                        "Point": {pointRadius: 5, graphicName: "star", fillColor: "white", fillOpacity: 0.25, strokeWidth: 1, strokeOpacity: 1, strokeColor: "#3333aa"},
                        "Line": {strokeWidth: 3, strokeOpacity: 1, strokeColor: "#ff0000"},
                        "Polygon": {strokeWidth: 1, strokeOpacity: 1, fillColor: "#9999aa", strokeColor: "#6666aa"}
                    }
                })
            ]
        }),
        "select": new OpenLayers.Style(null, {
            rules: [
                new OpenLayers.Rule({
                    symbolizer: {
                        "Point": {pointRadius: 5, graphicName: "star", fillColor: "white", fillOpacity: 0.25, strokeWidth: 2, strokeOpacity: 1, strokeColor: "#0000ff"},
                        "Line": {strokeWidth: 3, strokeOpacity: 1, strokeColor: "#0000ff"},
                        "Polygon": {strokeWidth: 2, strokeOpacity: 1, fillColor: "#0000ff", strokeColor: "#0000ff"}
                    }
                })
            ]
        }),
        /*Wordt gebruikt voor mouse pointer bij scenario*/
        "temporary": new OpenLayers.Style(null, {
            rules: [
                new OpenLayers.Rule({
                    symbolizer: {
                        "Point": { graphicName: "cross", pointRadius: 5, fillColor: "99ff99", fillOpacity: 0.5, strokeColor: "green", strokeWidth: 1, strokeOpacity: 1},
                        "Line": { strokeWidth: 3, strokeOpacity: 1, strokeColor: "#0000ff" },
                        "Polygon": { strokeWidth: 2, strokeOpacity: 1, strokeColor: "#0000ff", fillColor: "#0000ff" }
                    }
                })
            ]
        })
    });
    
    //ANNELIES: wordt niet gebruikt?
	var options = {
		isBaseLayer: true,
		transitionEffect: "resize",
		buffer: 1,
		useOverlay: false,
		useAsyncOverlay: false,
		singleTile: true,
		projection: "EPSG:31370"
	};
    
    //ANNELIES: wordt niet gebruikt?
	var params = {
		SESSION:session,
		MAPDEFINITION: 'Library://actiekaarten/achtergrond-all.MapDefinition',
		//VERSION: '1.2.0',
		//BASEMAPLAYERGROUPNAME:'TeleAtlas',
		CLIENTAGENT: 'actie'
	};

	//var layer = new OpenLayers.Layer.MapGuide("TeleAtlas", mapagent, params, options);
    //map.addLayer(layer);
    //window.TeleAtlas = layer;
	//map.setBaseLayer(layer);
    
    //ANNELIES: START TOEVOEGEN WMS: GRB basiskaart, orthofoto's Vlaanderen, orthofoto's Wallonië, Urbis, PICC
    var layer = new OpenLayers.Layer.WMS("GRB", "http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB-basiskaart/wms", 
    	{layers: "GRB_BSK"},{ singleTile: false, ratio: 1.2 });
    map.addLayer(layer);
	map.setBaseLayer(layer);
	
    /*
    layer = new OpenLayers.Layer.TMS("Ortho", "http://grb.agiv.be/geodiensten/raadpleegdiensten/geocache/tms/", 
		{serviceVersion: "1.0.0", layername: "orthoklm@BPL72VL", type: "png", tileOrigin: new OpenLayers.LonLat(9928, 66928), 
		serverResolutions: [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125], transitionEffect: 'resize'});
	*/
	
	var layer = new OpenLayers.Layer.WMS("Ortho", "http://geoservices.informatievlaanderen.be/raadpleegdiensten/omwrgbmrvl/wms", 
		{layers: "Ortho"}, { singleTile: false, ratio: 1.2 });
    map.addLayer(layer);

    var layer = new OpenLayers.Layer.WMS("OrthoWal", "http://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_2016/MapServer/WmsServer",
     	{layers: "0"}, { singleTile: true, ratio: 1.2 });
    map.addLayer(layer);
	
	var layer = new OpenLayers.Layer.WMS("Urbis", "http://www.gis.irisnet.be/arcgis/services/basemap/urbisNL/MapServer/WMSServer",
     	{layers: "0"}, { singleTile: false, ratio: 1.2 });
    map.addLayer(layer);
	
	var layer = new OpenLayers.Layer.WMS("PICC", "http://geoservices.wallonie.be/arcgis/services/TOPOGRAPHIE/PICC_VDIFF/MapServer/WmsServer",
     	{layers: "1,3,4,5,7,9,10,11,12,14,15,16,17,19,20,21,23,24,25,26,27,28,29"}, { singleTile: false, ratio: 1.2 });
    map.addLayer(layer);
    //ANNELIES: EINDE TOEVOEGEN WMS
	
	//LINTON : WMS OSM is niet herprojecteerbaar naar Lambert72, kan dus enkel gebruikt worden als basiskaart als de andere lagen geherprojecteerd worden naar WGS 84
	/*var layer = new OpenLayers.Layer.OSM("OpenStreetMap");
    map.addLayer(layer);*/ 
    
    //LINTON : WMS Google is niet herprojecteerbaar naar Lambert72, kan dus enkel gebruikt worden als basiskaart als de andere lagen geherprojecteerd worden naar googleprojectie
	/*var layer = new OpenLayers.Layer.Google("GoogleStreets");
    map.addLayer(layer);*/ 
    
	var renderer = OpenLayers.Layer.Vector.prototype.renderers;
   
    //map control om de dynamische laag aan/af te zetten
    points = new OpenLayers.Layer.Vector("Rupture", {styleMap: styles, isBaseLayer: false, preFeatureInsert: function (feature) { points.removeAllFeatures() } });
    map.addLayer(points); //ANNELIES: toevoegen van een lege vectorlaag voor punt van een scenario

    rupture = new OpenLayers.Control.DrawFeature( points, OpenLayers.Handler.Point, { displayClass: "olControlDrawFeaturePoint", title: "Draw Features" } );
    rupture.events.on({ "featureadded": ruptureAdded }); //ANNELIES: plaatsen van een punt op aangeklikte plaats
    map.addControl(rupture); //ANNELIES: functionaliteit toevoegen aan de kaart 

    //DIDIER : 12/09/2018 : laag voor zoommarker
    markers = new OpenLayers.Layer.Vector("Markers", {isBaseLayer: false, preFeatureInsert: function (feature) { markers.removeAllFeatures() } });
    map.addLayer(markers);

    var panel = new OpenLayers.Control.Panel({ displayClass: "olControlEditingToolbar" }); //ANNELIES: ?

    map.addControl(new OpenLayers.Control.Navigation({ dragPanOptions: {enableKinetic: true} }));
    
    //DIDIER : coordinaten rechtsonder toegevoegd
    map.addControl(new OpenLayers.Control.MousePosition());
    
    //LINTON : Uitgeschakeld om +- zoomknoppen te verwijderen
    /*map.addControl(new OpenLayers.Control.Zoom());*/
    /*map.addControl(new OpenLayers.Control.LayerSwitcher());*/
    map.addControl(new OpenLayers.Control.ScaleLine());

    //ANNELIES:tools om lengte en oppervlakte te meten
	keyboardControl = new OpenLayers.Control();
    options = {};
    callback = {
        keydown: function(evt) {
        if (evt.keyCode == 27){
			if (measureControls.line.active) measureControls.line.handler.finishGeometry();
			if (measureControls.polygon.active) measureControls.polygon.handler.finishGeometry();
            }
        }
    };
    
    keyHandler = new OpenLayers.Handler.Keyboard(keyboardControl, callback, options);
    keyHandler.activate();
	map.addControl(keyboardControl);

	addMeasurements();

    map.zoomToMaxExtent();
    window.map = map;
    //geolocate.activate();

}
