<cfif not IsDefined("Session.login") or not Session.login><cflocation url="index.cfm" addtoken="false" ></cfif>

<html>
<cfinclude template="../bs_head.cfm">
<cfset objBs.getCssLib()>
<cfset objBs.getJsLib()>
<cfobject component="CFC.ActieKaart" name="objAka">
<title>Actiekaarten</title>

<style>
	.Z1 {background-color: #FDAF7C;}  
	.Z2 {background-color: #FEE5B2;}  
	.Z3 {background-color: #FEFEB2;}  
</style>

<link rel="stylesheet" type="text/css" href="css/ui.anglepicker.css">
<!---<link rel="stylesheet" type="text/css" href="css/leidinginspectie.css" />--->

<script type="text/javascript" src="OpenLayers-2.13.1/OpenLayers.js"></script>
<script type="text/javascript" src="script/initmap.js"></script>
<script type="text/javascript" src="script/actiekaart.js"></script>
<script type="text/javascript" src="script/ui.anglepicker.js"></script>


<!--- 
<script type="text/javascript">
var Proj4js = window["Proj4js"] = window["Proj4js"] || {
    Proj: function(code) {
        var result = proj4(code);
        result.srsCode = code; // for ol2 compatibility
        return result;
    },
    defs: proj4.defs,
    transform: proj4
};

proj4.defs["EPSG:31370"] = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs";

</script>--->

<!--- proj4 toegevoegd Openlayers2
<script type="text/javascript" src="http://svn.osgeo.org/metacrs/proj4js/trunk/lib/proj4js-combined.js"></script>
<script>
proj4js.defs["EPSG:31370"] = "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs";
	console.log(Proj4js.defs["EPSG:31370"]);
</script>--->



<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15/proj4.js"></script> <!--- toegevoegd voor projectie Lambert 72 te definiëren in initMap.js --->
<script type="text/javascript" src="http://svn.osgeo.org/metacrs/proj4js/trunk/lib/proj4js-combined.js"></script>
<script>
proj4.defs("EPSG:31370", "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs")
</script>
<!--- toegevoegd voor projectie Lambert 72 te definiëren in initMap.js --->

<script type="text/javascript">
	var username = "<cfoutput>#Session.username#</cfoutput>";
    var map;
    var points;
    //Adjust the scale assumptions for MapGuide layers Tiled layers MUST use a DPI value of 96, untiled layers can use a different DPI value which will 
    // be passed to the server as a parameter. Tiled and untiled layers must adjust the OL INCHES_PER_UNIT values for any degree-based projections.
    var metersPerUnit = 1;  //value returned from mapguide
    var inPerUnit = OpenLayers.INCHES_PER_UNIT.m * metersPerUnit;
    var angle = 202.5;
    OpenLayers.INCHES_PER_UNIT["dd"] = inPerUnit;
    OpenLayers.INCHES_PER_UNIT["degrees"] = inPerUnit;
    OpenLayers.DOTS_PER_INCH = 96;
    //var mapagent = "/mapserver2016/mapagent/mapagent.fcgi";
    var mapdefinition = 'Library://leidinginfo/pipegeneral.MapDefinition';
    var vector = new OpenLayers.Layer.Vector('huidige positie');
    var polygons = new OpenLayers.Layer.Vector('Zones');
    var zone;
	
	/*var username = "<cfoutput>#Session.username#</cfoutput>";
    var map;
    var points;
    //Adjust the scale assumptions for MapGuide layers Tiled layers MUST use a DPI value of 96, untiled layers can use a different DPI value which will 
    // be passed to the server as a parameter. Tiled and untiled layers must adjust the OL INCHES_PER_UNIT values for any degree-based projections.
    var metersPerUnit = 1;  //value returned from mapguide
    var inPerUnit = 39.37
    var angle = 202.5;
    //ol.proj.INCHES_PER_UNIT["dd"] = inPerUnit;
    //ol.proj.INCHES_PER_UNIT["degrees"] = inPerUnit;
    ol.DOTS_PER_INCH = 96;
    //var mapagent = "/mapserver2016/mapagent/mapagent.fcgi";
    var mapdefinition = 'Library://leidinginfo/pipegeneral.MapDefinition';
    var vector = new ol.layer.Vector('huidige positie');
    var polygons = new ol.layer.Vector('Zones');
    var zone;*/
   
    $(function () {
    	initMapSession();
        //GetZones();
        //$("#wind").hide();
    });
</script>

<body>
<cfoutput>

<!---<cfset objBs.IconSize = 2>--->
<div style="padding-top:15px">
	<!------------------------------------------------------------------------------>
	<!--- GEDEELTE VAN HET SCHERM MET DE KAART                                   --->			
	<!------------------------------------------------------------------------------>
	<cfset mapPanel = 7>
	<cfset objBs.getConStart(mapPanel)>
	<cfset objBs.getPanelStart("Kaart")>
		<div class="panel-body">
			<div id="container">
				<div id="map" style="position: relative; padding-top: 100%; width: 100%; height: 90%"></div>
    		</div>
		</div>
		<cfset objBs.getPanelEnd()>
	<cfset objBs.getConEnd()>	
	<!------------------------------------------------------------------------------>
	<!--- GEDEELTE VAN HET SCHERM MET DE FUNCTIES (ZOEKEN - SCENARIO - KAART)    --->			
	<!------------------------------------------------------------------------------>
	<cfset objBs.getConStart(12-mapPanel)>
	<cfset objBs.getPanelStart("Functies")>
	<div class="panel-body">
		<ul class="nav nav-pills">
			<li class="active"><a data-toggle="pill" href="##tabZoek">#objBs.GetBsIcons("search")#&nbsp;Zoeken</a></li>
			<li><a data-toggle="pill" href="##tabScenario">#objBs.GetBsIcons("fire")#&nbsp;Scenario</a></li>
			<li><a data-toggle="pill" href="##tabKaart">#objBs.GetBsIcons("land")#&nbsp;Kaart</a></li>
		</ul>
		<div id="tabs" class="tab-content">
			<!---ZOEKEN--->
			<div id="tabZoek" class="tab-pane fade in active">
				<p></p>
				<div class="input-group">
					<input type="text" class="form-control input-#objBs.StyleCategorie#" id="zknVal" value="">
					<span class="input-group-btn"><button type="button"  id="zkn" class="btn btn-info btn-#objBs.StyleCategorie#">#objBs.GetBsIcons("search")#&nbsp;</button></span>
				</div>		
				<div id="zknDisplay"></div>
			</div>
			<!---SCENARIO--->
			<div id="tabScenario" class="tab-pane fade"> 
				<p></p>
				<button type="button" id="locatie" class="btn btn-info btn-#objBs.StyleCategorie#">#objBs.GetBsIcons("loc")#&nbsp;Leidingbreuk</button>
				<button type="button" id="scenarioReset" class="btn btn-default btn-#objBs.StyleCategorie#" style="display: none">#objBs.GetBsIcons("refresh")#&nbsp;Reset</button>
				<p></p>
				<div id="pipesDisplay"></div>
				<p></p>
				<div id="pipesScenaParam" hidden>
					<cfinclude template="ScenaParam.cfm">
				</div>		
			</div>
			<!---KAART--->
 			<div id="tabKaart" class="tab-pane fade">
 				<cfinclude template="tabKaart.cfm">
 			</div>
		</div>
	</div>
	<cfset objBs.getPanelEnd()>
	<cfset objBs.getConEnd()>
</div>
</cfoutput>	

<!---<script type="text/javascript">
    $("#hoek").anglepicker({
        start: function (e, ui) {
        },
        change: function (e, ui) {
            angle = ui.value;
            drawZones(false); //hertekenen zonder in/uit te zoomen
        },
        stop: function (e, ui) {
        },
        value: angle
    });

</script>--->

</body>
</html>

