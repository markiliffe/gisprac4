function init() {

//Stop the pink squaring
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

//Provide automatic bounds to zoom to.
var bounds = new OpenLayers.Bounds(
                    -1.3420263951787985, 52.79360357010032,
                    -0.683110818198141, 53.47801245310385
                );

// This is where the Javascript begins
var map = new OpenLayers.Map('map');

/*
 * This includes Mapbox tiles as a basemap. This was created in Tilemill from OpenStreetMap data.
 * The static HTML for this is here: http://a.tiles.mapbox.com/v3/markiliffe.map-2yitmcy5/page.html
 * Something is going on here with regards to the datum point.
 *
 */

var basemap = new OpenLayers.Layer.XYZ("MapBox Streets Basemap",
    [
        "http://a.tiles.mapbox.com/v3/markiliffe.map-2yitmcy5/${z}/${x}/${y}.png",
        "http://b.tiles.mapbox.com/v3/markiliffe.map-2yitmcy5/${z}/${x}/${y}.png",
        "http://c.tiles.mapbox.com/v3/markiliffe.map-2yitmcy5/${z}/${x}/${y}.png",
        "http://d.tiles.mapbox.com/v3/markiliffe.map-2yitmcy5/${z}/${x}/${y}.png"
    ], {
        attribution: "Tiles &copy; <a href='http://mapbox.com/'>MapBox</a>, Data (c) OpenStreetMap Odbl",
        sphericalMercator: true, 
        wrapDateLine: true,
        numZoomLevels: 16,
        isBaseLayer: true,

    }
);  

/*
 * Load an OpenStreetMap layer, constrain the number of zoom levels and make a baselayer.
 *
 *
 */

var osm = new OpenLayers.Layer.OSM("OpenStreetMap",
    {
        sphericalMercator: true, 
        wrapDateLine: true,
        numZoomLevels: 16,
        isBaseLayer: true,
    }

    );


/*
 * This layer incorporates the bus stops from geoserver.
 */

 buses  = new OpenLayers.Layer.WMS(
                    "Nottinghamshire Bus Stops", "http://localhost:8080/geoserver/giservices/wms",
                    {
                        LAYERS: 'giservices:BusStops',
                       // STYLES: 'BusStops_style',
                        tiled: true,
                        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
                    },
                    {
                        buffer: 0,
                        displayOutsideMaxExtent: true,
                        yx : {'EPSG:4326' : true},
                        isBaseLayer: false,
                        opacity: 0.3,
                        //transparent: true,
                    } 
                );


/*
 * This layer incorporates the layer 'Deprevation Indices by LSOA' from geoserver.
 */

lsoa_naptan_boundaries  = new OpenLayers.Layer.WMS(
                    "Deprevation Indices by LSOA", "http://localhost:8080/geoserver/giservices/wms",
                    {
                        LAYERS: 'giservices:LSOA_MyRegion_IMDjoin',
                        STYLES: 'LSOA_MyRegion_IMDjoin_NAPTANjoin_style',
                        tiled: true,
                        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
                    },
                    {
                        buffer: 0,
                        displayOutsideMaxExtent: true,
                        yx : {'EPSG:4326' : true},
                        isBaseLayer: false,
                        'format': 'image/png',
                        //transparent: true,
                        opacity: 0.3,
                    } 
                );


 /*
 * This layer incorporates the layer 'Boundaries by Bus Stop Count' from geoserver.
 */

 lsoa_indices_boundaries  = new OpenLayers.Layer.WMS(
                    "Count of Bus Stops by LSOA", "http://localhost:8080/geoserver/giservices/wms",
                    {
                        LAYERS: 'giservices:LSOA_MyRegion_IMDjoin_NAPTANjoin',
                        STYLES: 'LSOA_MyRegion_IMDjoin_style',
                        tiled: true,
                        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
                    },
                    {
                        buffer: 0,
                        displayOutsideMaxExtent: true,
                        yx : {'EPSG:4326' : true},
                        isBaseLayer: false,
                        'format': 'image/png',
                        //transparent: true,
                        opacity: 0.3,
                    } 
                );

//This combination centers the  map on Nottingham. Calling the map.setCentre(centre, zoomLevel) instead of ZoomToMaxExtent aids this. 
var center = new OpenLayers.LonLat(-1.13983, 52.9670).transform(
        'EPSG:4326', 'EPSG:3857' 
    );

//Load the basemaps
map.addLayer(basemap);
map.addLayer(osm);

//Load the layers
map.addLayer(buses);
map.addLayer(lsoa_indices_boundaries);
map.addLayer(lsoa_naptan_boundaries);

map.addControl(new OpenLayers.Control.LayerSwitcher()); 
    
map.setCenter(center,8);
//map.zoomToMaxExtent(); //This was removed to centre the map on Nottinghamshire upon opening the map.
}
