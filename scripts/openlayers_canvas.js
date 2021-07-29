/*****
* @author Cristina M. Iosifescu Enescu <ciosifescu@ethz.ch>
* Project Dream Cartography
* @copyright Institute of Cartography and Geoinformation, ETH Zurich, Switzerland
* Last modified: feb 28, 2018
*
*/

/******* Define layers for the map ***************/
var map,map1;
var dirty; //false in the beginning. if the map has been changed becomes true; if true, it triggers an onbeforeunload event, asking users if they want to leave page
var style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'black'
			})
		});
		//https://gis.stackexchange.com/questions/185881/clipping-tilelayer-with-georeferenced-polygon-clipping-mask

var clippedContinents_V = new ol.layer.Image({
		source: new ol.source.ImageVector({
    		source: new ol.source.Vector({
      			url: '//openlayers.org/en/v3.14.2/examples/data/geojson/countries.geojson',
      			format: new ol.format.GeoJSON()
    			}),
    		style: style
  			})
		});

clippedContinents_V.on('postcompose', function(e) {
	//var ctxt = e.context;
	//ctxt.restore();
	e.context.globalCompositeOperation = 'source-over';
	});
										
clippedContinents_V.on('precompose', function(e) {
	e.context.globalCompositeOperation = 'destination-out';
	//var ctxt = e.context;
    //var vecCtxt = e.vectorContext;
    //ctxt.save();
    // Using a style is a hack to workaround a limitation in
    // OpenLayers 3, where a geometry will not be draw if no
    // style has been provided.
    //vecCtxt.setFillStrokeStyle(new ol.style.Fill({color: [0, 0, 0, 0]}), null);
    //vecCtxt.drawCircleGeometry(new ol.geom.Circle([1000000, 1000000], 5000000));
    //ctxt.clip();
	});
										
var osm_clipped_R = new ol.layer.Tile({
		source: new ol.source.OSM()
		});
		
osm_clipped_R.on('precompose', function(e) {
	//e.context.globalCompositeOperation = 'destination-out';
	var ctxt = e.context;
    var vecCtxt = e.vectorContext;
    ctxt.save();
    // Using a style is a hack to workaround a limitation in
    // OpenLayers 3, where a geometry will not be draw if no
    // style has been provided.
    vecCtxt.setStyle(new ol.style.Style({
		fill: new ol.style.Fill({
			color: [0, 0, 0, 0]
			})
		})
		);
    vecCtxt.drawGeometry(new ol.geom.Circle([1000000, 1000000], 5000000));
    ctxt.clip();
});

osm_clipped_R.on('postcompose', function(e) {
	var ctxt = e.context;
	ctxt.restore();
	//e.context.globalCompositeOperation = 'source-over';
});


//this layer will be clipped and take the form of a geometry draw on the screen
//e.g. by Area (freehand)
var feature_to_clip;
var geometry_to_clip = new ol.geom.Circle([1000000, 1000000], 3000000);//feature_to_clip.getGeometry();

var clipped_now_R = new ol.layer.Tile({
		source: new ol.source.OSM()
		});

clipped_now_R.on('precompose', function(e) {
	//e.context.globalCompositeOperation = 'destination-out';
	var ctxt = e.context;
    var vecCtxt = e.vectorContext;
    ctxt.save();
    // Using a style is a hack to workaround a limitation in
    // OpenLayers 3, where a geometry will not be draw if no
    // style has been provided.
    vecCtxt.setStyle(new ol.style.Style({
		fill: new ol.style.Fill({
			color: [0, 0, 0, 0]
			})
		})
		);
    vecCtxt.drawGeometry(geometry_to_clip);
    ctxt.clip();
});

clipped_now_R.on('postcompose', function(e) {
	var ctxt = e.context;
	ctxt.restore();
	//e.context.globalCompositeOperation = 'source-over';
});
		
var bing_aerial_R = new ol.layer.Tile({
          source: new ol.source.BingMaps({
            key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
            imagerySet: 'Aerial',
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            // maxZoom: 19
          })
        });



		
//https://stackoverflow.com/questions/24315801/how-to-add-markers-with-openlayers-3?rq=1
var vectorSource = new ol.source.Vector({
	//create empty vector
    });
										    
//create a bunch of icons and add to source vector
for (var i=0;i<30;i++){
		var iconFeature = new ol.Feature({
          	geometry: new ol.geom.Point(
				ol.proj.transform([Math.random()*360-180, Math.random()*180-90], 'EPSG:4326',   'EPSG:3857')),
        	name: 'Null Island ' + i,
        	population: 4000,
        	rainfall: 500
        	});
        vectorSource.addFeature(iconFeature);
    }
	
var secondvectorSource = new ol.source.Vector({
		//create empty vector
    	});
										    
    //create a bunch of icons and add to source vector
for (var i=0;i<25;i++){
		var iconFeature = new ol.Feature({
          		geometry: new ol.geom.Point(
					ol.proj.transform([Math.random()*360-180, Math.random()*180-90], 'EPSG:4326',   'EPSG:3857')),
        		name: 'Marker ' + i,
        		population: 6000,
        		rainfall: 100
        });
        secondvectorSource.addFeature(iconFeature);
    }
										
var mapmarkerstyle = new ol.style.Style({
			text: new ol.style.Text({
				text: '\uf041',
				font: 'normal 30px FontAwesome',
				textBaseline: 'Bottom',
				fill: new ol.style.Fill({
							color: 'blue',
							})
				})
		});
										
var randompoints_V = new ol.layer.Vector({
      		source: secondvectorSource,
      		style: mapmarkerstyle
    		});
			
									    
										
var mapmarkerstylered = new ol.style.Style({
			text: new ol.style.Text({
				text: '\uf041',
				font: 'normal 30px FontAwesome',
				textBaseline: 'Bottom',
				fill: new ol.style.Fill({
							color: 'red',
							})
				})
		});
										

			
    //create the style
    /*var iconStyle = new ol.style.Style({
      	image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ //({
        /*anchor: [0.475, 0.725],//[0.5, 1],
        	anchorXUnits: 'fraction',
        	anchorYUnits: 'fraction',
        	opacity: 1,//0.75,
        	src: 'icons/marker_in_hand_40.svg'//'icons/marker_simplu_mov_turcoaz.svg'
      		}))
    		});*/

	//create the style
    
var iconStyle = new ol.style.Style({
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        				anchor: [0.61, 0.91],//[0.5, 1],
        				anchorXUnits: 'fraction',
        				anchorYUnits: 'fraction',
        				opacity: 1,//0.75,
        				src: 'icons/home_sweet_home_honney.svg'//'icons/marker_simplu_mov_turcoaz.svg'
      		}))
    });

//add the feature vector to the layer vector, and apply a style to whole layer
var homesweethome_V = new ol.layer.Vector({
      		source: vectorSource,
      		style: iconStyle
    });
																				
var iconNamePicior = 'icons/picior.svg';
var iconStylePicior = new ol.style.Style({
      		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        				anchor: [0.5, 0.5],
        				anchorXUnits: 'fraction',
        				anchorYUnits: 'fraction',
        				opacity: 0.75,
        				src: iconNamePicior
      		}))
    });
iconNamePiciorStang = 'icons/picior_stang.svg';	  
var iconStylePiciorStang = new ol.style.Style({
      		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        				anchor: [0.5, 0.5],
        				anchorXUnits: 'fraction',
        				anchorYUnits: 'fraction',
        				opacity: 0.75,
        				src: iconNamePiciorStang
      		}))
    });
var iconNamePerna = 'icons/perna.svg';
var iconStylePerna = new ol.style.Style({
      		image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        				anchor: [0.5, 0.5],
        				anchorXUnits: 'fraction',
        				anchorYUnits: 'fraction',
        				opacity: 0.75,
        				src: iconNamePerna
      		}))
    });
										
//create random points on the map
//document.getElementById("addLandmark_icon").innerHTML="<img src='"+iconNamePicior+"'/>";
var landmarksSource = new ol.source.Vector();
var addLandmarks_V = new ol.layer.Vector({
    		source: landmarksSource,
			style: iconStylePicior
			/*style: new ol.style.Style({
						fill: new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.2)'
								}),
						stroke: new ol.style.Stroke({
								color: '#ffcc33',
								width: 2
								}),
						image: new ol.style.Circle({
								radius: 7,
								fill: new ol.style.Fill({
										color: '#ffcc33'
									})
								})
        	})*/
    });
	

	var rasterGreyed =  new ol.source.Raster({
			sources: [new ol.source.Stamen({
				layer: 'watercolor'
    			})],
    		operation: function (pixels, data) {
							var pixel = pixels[0];
							var lightness = (pixel[0] * 0.3 + pixel[1] * 0.59 + pixel[2] * 0.11);
							return [lightness, lightness, lightness, pixel[3]];
    					},
  	});
	


var stamenWatercolorG_R = new ol.layer.Image({source: rasterGreyed});
										
var stamenToner_R = new ol.layer.Tile({
			source: new ol.source.Stamen({
			layer: 'toner'//toner, watercolor, terrain
			})
	});

	
	
var grad_canvas = document.createElement('canvas');
grad_canvas.setAttribute("id","grad_canvas");
var grad_context = grad_canvas.getContext('2d');

      // Gradient and pattern are in canvas pixel space, so we adjust for the
      // renderer's pixel ratio
      var pixelRatio = ol.has.DEVICE_PIXEL_RATIO;

      // Generate a rainbow gradient
      function gradient(feature, resolution) {
        var extent = feature.getGeometry().getExtent();
        // Gradient starts on the left edge of each feature, and ends on the right.
        // Coordinate origin is the top-left corner of the extent of the geometry, so
        // we just divide the geometry's extent width by resolution and multiply with
        // pixelRatio to match the renderer's pixel coordinate system.
        var widt = (ol.extent.getWidth(extent) / resolution * pixelRatio);
		var grad = grad_context.createRadialGradient(widt/2, widt/2,
            widt/2, widt/2,widt/2, 0);
        grad.addColorStop(0, 'rgba(79,2,139,0)');
        grad.addColorStop(1, 'rgba(79,2,139,1)');
        return grad;
      }	
	  
	  // Generate style for gradient or pattern fill
      var fill = new ol.style.Fill();
      var grad_style = new ol.style.Style({
        fill: fill,
		});
	  var gradientFillStyle = function(feature, resolution){
			fill.setColor(gradient(feature,resolution));
			//console.log("circle gradient");
			return grad_style
	  }
	  
	
	
//for the geojson object received from Nomination service of OpenStreetMaps
var styles_json = {
        'Point': iconStylePerna,
        'LineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 4
          })
        }),
        'Polygon': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        }),
      }; 
	  
var styles = {
        'Point': iconStylePicior
        ,
        'LineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgb(79,2,139)',
            width: 4
          })
        }),
        'MultiLineString': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'green',
            width: 1
          })
        }),
        'MultiPoint': mapmarkerstylered
		,
        'MultiPolygon': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'yellow',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.1)'
          })
        }),
        'Polygon': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        }),
        'GeometryCollection': new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'magenta',
            width: 2
          }),
          fill: new ol.style.Fill({
            color: 'magenta'
          }),
          image: new ol.style.Circle({
            radius: 10,
            fill: null,
            stroke: new ol.style.Stroke({
              color: 'magenta'
            })
          })
        }),
        'Circle': gradientFillStyle
			//new ol.style.Style({
          //stroke: new ol.style.Stroke({
          //  color: 'red',
          //  width: 2
          //}),
          //fill: new ol.style.Fill({
           // color: 'rgba(255,0,0,0.2)'
          //})
        //})
      };

var styleFunction = function(feature,resolution) {
	if (feature.getGeometry().getType()=="Circle") return gradientFillStyle(feature,resolution); else
	return styles[feature.getGeometry().getType()];
    };
var styles_jsonFunction = function(feature) {
	return styles_json[feature.getGeometry().getType()];
    };
	
var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857'
          }
        },
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
          }
        }]};	
 var geojson_vectorSource = new ol.source.Vector({
        //features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
      });
var geojsonPlaces_V = new ol.layer.Vector({
        source: geojson_vectorSource,
        style: styles_jsonFunction
      });	 
	  
	  
var playgroundSource = new ol.source.Vector();
var playground_V = new ol.layer.Vector({
	source: playgroundSource,
	style: styleFunction
	});	
	
	
/**** Interactively add features to the map in the playground_V layer*************************/
var draw, snap, modify;
/** points **/
function addLandmark(al) {
	var es = document.getElementById("addLandmark_icon");
	if (es.innerHTML=="") 
		es.innerHTML="<img src='"+iconNamePicior+"' style='vertical-align:middle'/>";
	var butAnschrift = "Add Landmark";
	var ali = document.getElementById("addLandmark");
	if (al) 
		if (al.value)
			butAnschrift = al.value; 
	
	if (butAnschrift=="Add Landmark") {
		ali.value = "Stop";
		ali.style.color="#ffd749";
		modify = new ol.interaction.Modify({source: landmarksSource});
		map.addInteraction(modify);
		
		snap = new ol.interaction.Snap({source: landmarksSource});
		map.addInteraction(snap);

		draw = new ol.interaction.Draw({
          source: landmarksSource,
          type: "Point"
		  
			});
		map.addInteraction(draw);
	}
	else {
		ali.value = "Add Landmark";	
		ali.style.color="";
		map.removeInteraction(draw);
		map.removeInteraction(snap);	
		map.removeInteraction(modify);
	}

}												

/******To change the icon for the landmark (AddLandmark button in the Map Tab)*/
function changeLandmarkIcon(target) {
var src = target.src;
src = src.substring(0,src.indexOf("icons"));
//alert(src);
var imageid = target.id;

if (target.src.indexOf("stang")>-1) {
		document.getElementById(imageid).src = src + "icons/picior.svg";
		addLandmarks_V.setStyle(iconStylePicior);
		//addLandmarks_V.redraw();
		}
	else {
		document.getElementById(imageid).src = src + "icons/picior_stang.svg";
		addLandmarks_V.setStyle(iconStylePiciorStang);
		//addLandmarks_V.redraw();
	}
}

/** features **/
var default_playgroundFeaturesInfo = "Map canvas is active";
var drawFeatureId = 9001;
function addVector(al) {
	var butAnschrift = "Add Feature";
	var ali = document.getElementById("addFeature");
	if (al) {
		if (al.value)
			butAnschrift = al.value; }
	else map.removeInteraction(draw);
console.log(butAnschrift);	
	if (butAnschrift=="Add Feature") {
		document.getElementById("playgroundFeaturesInfo").innerHTML = "Click on map to add feature";
		document.getElementById("addFeature").style.color = "#ffd749";
		ali.value = "Stop";

		var freeha = true;
		var selectedType = document.getElementById("feature_type").value;
		
		if (selectedType.indexOf("_p")>-1)  { //polyline & polygon
			selectedType = selectedType.substring(0,selectedType.length-2);
			console.log(selectedType);
			freeha = false;
			}
			
		draw = new ol.interaction.Draw({
			source: playgroundSource,
			type: selectedType,
			freehand: freeha
			});
		map.addInteraction(draw);
		
		draw.on('drawend', function (e) {
			e.feature.setId(drawFeatureId);//this is the feature which fired the event
			drawFeatureId +=1;
			});
	}
	else {
		ali.value = "Add Feature";	
		document.getElementById("playgroundFeaturesInfo").innerHTML = default_playgroundFeaturesInfo;
		document.getElementById("addFeature").style.color = "";
		map.removeInteraction(draw);
	}

}

function modifyVector(al) {
	var butAnschrift = "Modify Feature";
	var ali = document.getElementById("modifyFeature");
	if (al) if (al.value)
		butAnschrift = al.value;

	if (butAnschrift=="Modify Feature") {
		document.getElementById("playgroundFeaturesInfo").innerHTML = "Click on a feature to modify it";
		ali.style.color = "#ffd749";
		ali.value = "Stop";

		modify = new ol.interaction.Modify({source: playgroundSource});
		map.addInteraction(modify);
		snap = new ol.interaction.Snap({source: playgroundSource});
		map.addInteraction(snap);
	}
	else {
		ali.value = "Modify Feature";	
		document.getElementById("playgroundFeaturesInfo").innerHTML = default_playgroundFeaturesInfo;
		ali.style.color = "";
		map.removeInteraction(modify);
		map.removeInteraction(snap);
	}

}

var select;
var selectedFeatureIDs = [];

function removeVector(al) {
	var butAnschrift = "Remove Feature";
	var ali = document.getElementById("removeFeature");
	if (al) if (al.value)
		butAnschrift = al.value;
console.log(butAnschrift);
	if (butAnschrift=="Remove Feature") {
		document.getElementById("playgroundFeaturesInfo").innerHTML = "Select feature(s) to remove";
		ali.style.color = "#ffd749";
		ali.value = "Select Feature to Remove";
		select = new ol.interaction.Select({source: playgroundSource});
		map.addInteraction(select);
		snap = new ol.interaction.Snap({source: playgroundSource});
		map.addInteraction(snap);
		select.getFeatures().on('add',function (event) {
			//var prop = event.element.getProperties();
			selectedFeatureIDs.push(event.element.getId());
			ali.value = "Remove Selected Feature";
			document.getElementById("playgroundFeaturesInfo").innerHTML = "Click again on [-] to remove selected feature(s)";
			});
		select.getFeatures().on('remove',function (event) {
			//var prop = event.element.getProperties();
			selectedFeatureIDs.splice(selectedFeatureIDs.indexOf(event.element.getId()),1);
			//console.log("splice selectedIDs: "+selectedFeatureIDs);
			ali.value = "Select Feature to Remove";
			document.getElementById("playgroundFeaturesInfo").innerHTML = "Select feature(s) to remove";
			if (selectedFeatureIDs.length==0) {
				ali.value = "Remove Feature";	
				document.getElementById("playgroundFeaturesInfo").innerHTML = default_playgroundFeaturesInfo;
				ali.style.color = "";
				map.removeInteraction(select);
				map.removeInteraction(snap);
				}
			});
			
		
					
		//if (select.getFeatures()) 
			//playgroundSource.removeFeature(select.getFeatures());
		
	}
	else if (butAnschrift=="Remove Selected Feature") {
			removeSelectedFeatures();
			ali.value = "Remove Feature";	
			document.getElementById("playgroundFeaturesInfo").innerHTML = default_playgroundFeaturesInfo;
			ali.style.color = "";
			map.removeInteraction(select);
			map.removeInteraction(snap);
			}

}

function removeSelectedFeatures() {
		var playgroundFeatures = playgroundSource.getFeatures();
		if (playgroundFeatures != null && playgroundFeatures.length >0) {
			for (var x in playgroundFeatures) {
				//var prop = playgroundFeatures[x].getProperties();
				
				var id = playgroundFeatures[x].getId();
				//console.log(id + " vs. selected " + selectedFeatureIDs);
				if (selectedFeatureIDs.includes(id)) {
					selectedFeatureIDs.splice(selectedFeatureIDs.indexOf(id),1);
					playgroundSource.removeFeature(playgroundFeatures[x]);
					
				}
			}
		}
}

var sf_id=null;
function clipRasterWithSelectedArea(al) {
if (al.value=="Clip With Area") {
		al.value = "Select Area to Clip with";
		select = new ol.interaction.Select({
			source: playgroundSource,
			/*filter: new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.OR,
                        filters: [
                            new OpenLayers.Filter.Comparison({
                                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                property: "type", value: "Polygon"
                            }),
							],*/
			filter: function(feature, layer) {
				var fe = null;
				if (feature.getGeometry().getType() == "Polygon" || feature.getGeometry().getType()=="Circle")
					fe = feature;
				/*
				if (feature.type=="Polygon")
					fe = feature;*/
				return fe;
				}
			});
		map.addInteraction(select);
		snap = new ol.interaction.Snap({source: landmarksSource});
		map.addInteraction(snap);
		select.getFeatures().on('add',function (event) {
			//var prop = event.element.getProperties();
			sf_id = event.element.getId();
			al.value = "Clip with Selected Area";
			
			});
		select.getFeatures().on('remove',function (event) {
			//var prop = event.element.getProperties();
			sf_id = null;
			//console.log("splice selectedIDs: "+selectedFeatureIDs);
			al.value = "Select Area to Clip with";
			if (sf_id) {
				al.value = "Clip With Area";	
				map.removeInteraction(select);
				map.removeInteraction(snap);
				}
			});
			
		
					
		//if (select.getFeatures()) 
			//playgroundSource.removeFeature(select.getFeatures());
		
	}
	else if (al.value=="Clip with Selected Area") {
			clipWithSelectedFeature();
			al.value = "Clip With Area";	
			map.removeInteraction(select);
			map.removeInteraction(snap);
			}

}

function clipWithSelectedFeature() {
var playgroundFeatures = playgroundSource.getFeatures();
		if (playgroundFeatures != null && playgroundFeatures.length >0) {
			for (var x in playgroundFeatures) {
				//var prop = playgroundFeatures[x].getProperties();
				
				var id = playgroundFeatures[x].getId();
				//console.log(id + " vs. selected " + selectedFeatureIDs);
				if (sf_id ==id) {
					sf_id=null;
					geometry_to_clip = playgroundFeatures[x].getGeometry();
					
					clipped_now_R.on('precompose', function(e) {
	//e.context.globalCompositeOperation = 'destination-out';
	var ctxt = e.context;
    var vecCtxt = e.vectorContext;
    ctxt.save();
    vecCtxt.setStyle(new ol.style.Style({
		fill: new ol.style.Fill({
			color: [0, 0, 0, 0]
			})
		})
		);
    vecCtxt.drawGeometry(geometry_to_clip);
    ctxt.clip();
});

clipped_now_R.on('postcompose', function(e) {
	var ctxt = e.context;
	ctxt.restore();
	//e.context.globalCompositeOperation = 'source-over';
});
					
					//map.redraw;
				}
			}
		}
}


//source http://openlayers.org/en/latest/examples/drag-and-drop-image-vector.html 2017
var dragAndDropInteraction;
function allowDragDropVector(al) {
var butAnschrift = "Drag and Drop vector File";
	var ali = document.getElementById("draganddropFeatures");
	if (al) if (al.value)
		butAnschrift = al.value; 
	
console.log(butAnschrift);		  
	if (butAnschrift=="Drag and Drop vector File") {	
		document.getElementById("playgroundFeaturesInfo").innerHTML = "Drag and Drop external KML, JSON, GPX or IGC vector File onto the map";
		ali.style.color = "#ffd749";
		ali.value = "Stop";
		dragAndDropInteraction = new ol.interaction.DragAndDrop({
			source: playgroundSource,
			formatConstructors: [
				ol.format.GPX,
				ol.format.GeoJSON,
				ol.format.IGC,
				ol.format.KML,
				ol.format.TopoJSON
			]
		});
		map.addInteraction(dragAndDropInteraction);
	}
	else {
		ali.value = "Drag and Drop vector File";	
		document.getElementById("playgroundFeaturesInfo").innerHTML = default_playgroundFeaturesInfo;
		ali.style.color = "";
		map.removeInteraction(dragAndDropInteraction);
	}
}


/******* help variables for the sortable list *****/
var removableX = ' <i class="fa fa-remove js-remove"></i>';											
		
function getMapLayersFromList(list,mapEl) {
	if (mapEl==map)
		var str = "map"
		else var str = "map1";	
		
	var laName = '';
	var newLaCollection = '';
	//console.log(list);
	var kids = list.getElementsByTagName("li");
	for (var i=0;i<kids.length; i++) {
		laName = kids[i].innerHTML;
		laName = laName.slice(0,laName.length-removableX.length);
		if (laName>=" ") {
		console.log("layer " + laName + " was added to " + str );
		newLaCollection+=laName+',';}
		/*if (laName=="playground_V") {	 
			document.getElementById("addFeature").disabled = '';
			document.getElementById("modifyFeature").disabled = '';
			document.getElementById("removeFeature").disabled = '';
			}
		if (laName=="addLandmarks_V") {
			document.getElementById("addLandmark").disabled = ''; 
			}*/
		}
	var tokens = newLaCollection.split( "," );
	newLaCollection = tokens.reverse().join(",");
	newLaCollection = newLaCollection.slice(1,newLaCollection.length);

	console.log("the map named "+str +" contains these layers: " + newLaCollection);
	
	var newLaGroup = eval("new ol.layer.Group({layers: ["+newLaCollection+"]})");
	mapEl.setLayerGroup(newLaGroup);
}			
		
function addCanvas() {
	console.log("addCanvas");
	//add a new sortable list with the layers of the new canvas
	var el = document.getElementById('available_layers_list');
	el.style.cssFloat = 'left';
	var newEl = document.createElement('div');
	//<img src="icons/glob_jumate_points.svg" height="60" width="60"/>  <img src="icons/sort.svg" height="50" width="50"/>
	var newLa = document.createElement('label');
	newLa.setAttribute("for","layersNewCanvas");
	newLa.innerHTML = "<img src='icons/glob_jumate_points_mov.svg' height='50' width='50' style='vertical-align:middle'/> Additional Map Layers:";
	//newLa.appendChild(newIm1);
	newEl.appendChild(newLa);
	var newUl = document.createElement('ul');
	newUl.setAttribute("id",'layersNewCanvas');
	newUl.setAttribute("class","active_list");
	var newLi = document.createElement('li');
	newUl.appendChild(newLi);
	newEl.appendChild(newUl);
	el.parentNode.insertBefore(newEl,el.nextSibling);
	//el.parentNode.parentNode.parentNode.insertBefore(newTd,el.parentNode.parentNode.nextSibling);
	//add a new canvas
	var el = document.getElementById("ol_map");
	var newEl = document.createElement("div");
	newEl.setAttribute("id","ol1_map");
	newEl.setAttribute("class","map");
	//newEl.setAttribute("style","z-index:4");
	newEl.setAttribute("style","position: absolute;");
	el.parentNode.insertBefore(newEl,el.nextSibling);

	//if this canvas is not already from the db in the list, then
	//add the new canvas on the list order at the second last position
	var el = document.getElementById("canvases");
	if (el.innerHTML.indexOf("dditional")==-1) {
		var newLi = document.createElement("li");
		newLa = document.createElement("label");

		var newRa = document.createElement("input");
	//<input type="radio" id="orderFrame" name="formactive" value="frame">
		newRa.setAttribute("type","radio");
		newRa.setAttribute("id","orderMap2");
		newRa.setAttribute("name","formactivechild");
		newRa.setAttribute("value","Additional_Map_Canvas");
		newRa.setAttribute("onChange","setActiveCanvas(this)");
		newLa.appendChild(newRa);
		var newIm1 = document.createElement('img');
		newIm1.setAttribute("src","icons/glob_jumate_points_mov.svg");
		newIm1.setAttribute("height","50");
		newIm1.setAttribute("width","50");
		newLa.appendChild(newIm1);
		newLa.innerHTML += "<span> Additional Map</span>";
		newLi.appendChild(newLa);
		el.insertBefore(newLi,el.lastChild.previousSibling);
	}
	
	map1 = new ol.Map({
	layers: [
		//stamenToner_R,
		//stamenWatercolorG_R,
		//osm_clipped_R,
		//clipLayer,
		//homesweethome_V,
		//addLandmarks_V,
		//geojsonPlaces_V,
		//playground_V
		],
	logo: false,										
	target: 'ol1_map',										
	//allows rotation with alt+shift+drag										
	controls: ol.control.defaults({										
		attributionOptions:  ({									
			collapsible: false										
			})    									
		}),										
     view: new ol.View({   									
		center: ol.proj.fromLonLat([8, 45]),									
		zoom: 5									
		})									
	});			
	var els = document.getElementsByTagName("canvas");
	var el = els[1];
	el.setAttribute("id","Additional_Map_Canvas");

	var layerNewCanvas = Sortable.create(document.getElementById('layersNewCanvas'), {
		group: { 
			name: 'layers',
			},
		animation: 150,
		filter: '.js-remove',
		onFilter: function (evt) {
			var itemEl = evt.item;
			var laName = '';
			laName = itemEl.innerHTML;
			laName = laName.slice(0,laName.length-removableX.length);
			eval("map1.removeLayer("+laName+")");
			itemEl.parentNode.removeChild(itemEl);
		},
		// Element is dropped into the list from another list
		onAdd: function (/**Event*/evt) {
			if (evt.item.innerHTML.indexOf(removableX)<0)
				evt.item.innerHTML += removableX;
		},
		onSort: function (/**Event*/evt) {
			var itemEl = evt.item;
			getMapLayersFromList(itemEl.parentElement,map1);
			/*var laName = '';
			var newLaCollection = '';
			for (var i=0;i<itemEl.parentElement.children.length; i++) {
				laName = itemEl.parentElement.children[i].innerHTML;
				laName = laName.slice(0,laName.length-removableX.length);
				console.log(laName);
				newLaCollection+=laName+',';
				}
			var tokens = newLaCollection.split( "," );
			newLaCollection = tokens.reverse().join(",");
			newLaCollection = newLaCollection.slice(1,newLaCollection.length);
			console.log(newLaCollection);
			var newLaGroup = eval("new ol.layer.Group({layers: ["+newLaCollection+"]})");
			map1.setLayerGroup(newLaGroup);*/
		},
	});	
	//document.getElementById("addCanvas").disabled = 'disabled';
	document.getElementById("addCanvas").style.display = 'none';
	return ;
}	

/***** At the Canvas Order tab, the functionality of the radio buttons
			is to set the canvas active, in control */
function setActiveCanvas(target) {
document.getElementById(target.value).style.pointerEvents = 'auto';
if (target.value.indexOf("Map")>-1) {
	document.getElementById(target.value).parentElement.parentElement.style.pointerEvents = 'auto';
	//mousepointer hand
	document.getElementById(target.value).parentElement.parentElement.style.cursor = "move";
	}
	
var listEls = document.getElementById("formactive").getElementsByTagName("input");
if (target.value=="Map_Canvas") {
	document.getElementById("addLandmark").disabled = ''; 
	//document.getElementById("addFeature").disabled = '';
	document.getElementById("addFeature").style.color = "";
	document.getElementById("modifyFeature").style.color = "";
	document.getElementById("removeFeature").style.color = "";
	//document.getElementById("modifyFeature").disabled = '';
	//document.getElementById("removeFeature").disabled = '';
	document.getElementById("playgroundFeaturesInfo").innerHTML="Map canvas is active"
	}
	else {
	document.getElementById("addLandmark").disabled = 'disabled';
	//document.getElementById("addFeature").disabled = 'disabled';
	document.getElementById("addFeature").style.color = "grey";
	document.getElementById("modifyFeature").style.color = "grey";
	document.getElementById("removeFeature").style.color = "grey";
	document.getElementById("draganddropFeatures").style.color = "grey";
	//document.getElementById("modifyFeature").disabled = 'disabled';
	//document.getElementById("removeFeature").disabled = 'disabled';
	document.getElementById("playgroundFeaturesInfo").innerHTML="Map canvas is not active"
	}

for (var i=0; i<listEls.length; i++) {
	if (listEls[i].value != target.value) {
		document.getElementById(listEls[i].value).style.pointerEvents = 'none';
		if (listEls[i].value.indexOf("Map")>-1)
			document.getElementById(listEls[i].value).parentElement.parentElement.style.pointerEvents = 'none';
		}
			
	}
console.log(target.value + " is active");
if (target.value=="Free_Drawing_Canvas") {
	//mousepointer cross
	document.getElementById(target.value).parentElement.parentElement.style.cursor = "url('https://dreams.ethz.ch/icons/pen.cur'),crosshair";
	}
if (target.value=="Frame_Canvas") {
	//mousepointer cross
	document.getElementById(target.value).parentElement.parentElement.style.cursor = "default";
	}
}
																				
											
/******** Auto-executing function ****************/
(function () {
var byId = function (id) { return document.getElementById(id); },

		loadScripts = function (desc, callback) {
			var deps = [], key, idx = 0;

			for (key in desc) {
				deps.push(key);
			}

			(function _next() {
				var pid,
					name = deps[idx],
					script = document.createElement('script');

				script.type = 'text/javascript';
				script.src = desc[deps[idx]];

				pid = setInterval(function () {
					if (window[name]) {
						clearTimeout(pid);

						deps[idx++] = window[name];

						if (deps[idx]) {
							_next();
						} else {
							callback.apply(null, deps);
						}
					}
				}, 30);

				document.getElementsByTagName('head')[0].appendChild(script);
			})()
		},

		console = window.console;


	if (!console.log) {
		console.log = function () {
			alert([].join.apply(arguments, ' '));
		};
	}
})();


/******* Executes when the HTML Document DOM finished loading ******/
document.addEventListener("DOMContentLoaded", function () {

map = new ol.Map({
	//interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
	layers: [
		//stamenToner_R,
		//stamenWatercolorG_R,
		//osm_clipped_R,
		//clipLayer,
		//homesweethome_V,
		//addLandmarks_V
		//playground_V
		],
	logo: false,										
	target: 'ol_map',										
	//allows rotation with alt+shift+drag										
	controls: ol.control.defaults({										
		attributionOptions: /** @type {olx.control.AttributionOptions} */ ({									
			collapsible: false										
			})    									
		}),										
     view: new ol.View({   									
		center: ol.proj.fromLonLat([8, 45]),									
		zoom: 5									
		})									
});										
										
										
var map_canvas = document.getElementsByTagName("canvas")[0];   // Get the <canvas> element in the document
var att = document.createAttribute("id");       // Create an "id" attribute
att.value = "Map_Canvas";                           // Set the value of the id attribute
map_canvas.setAttributeNode(att);
map_canvas.style.zIndex = -1;
		
										
/**************** Editable list https://rubaxa.github.io/Sortable/ ********/
	
	//displayed layers
	var editableList = Sortable.create(document.getElementById('editables'), {
		group: { 
			name: 'layers',
			},
		animation: 150,
		filter: '.js-remove',
		onFilter: function (evt) {
			var itemEl = evt.item;
			var laName = '';
			laName = itemEl.innerHTML;
			laName = laName.slice(0,laName.length-removableX.length);
			eval("map.removeLayer("+laName+")");
			itemEl.parentNode.removeChild(itemEl);
		},
		// Element is dropped into the list from another list
		onAdd: function (/**Event*/evt) {
			if (evt.item.innerHTML.indexOf(removableX)<0)
				evt.item.innerHTML += removableX;
		},
		onSort: function (/**Event*/evt) {
			var itemEl = evt.item;
			getMapLayersFromList(itemEl.parentElement, map);
			
		},
	});	
	//available layers
	var layersPool = Sortable.create(document.getElementById('allLayers'), {
		group: { 
			name: 'layers',
			pull: 'clone',
			put: false
			},
		sort: false,
		animation: 150,
	});
		
	//canvas order
	var canvases = Sortable.create(document.getElementById('canvases'), {
		group: { 
			name: 'canvases',
			put: false
			},
		animation: 150,
		filter: 'input',
		preventOnFilter: false,
		onSort: function(evt) {
			var itemEl = evt.item.parentElement;
			var listEls = itemEl.getElementsByTagName("span");
			var zIn = listEls.length;//itemEl.children.length;
			for (var i=0; i<listEls.length; i++) { //itemEl.children.length
				
				var caName = listEls[i].innerHTML; //itemEl.children
				caName = caName.substring(caName.indexOf(">")+2,caName.length);
				caName = caName.split(" ").join("_") + "_Canvas";
				//console.log(caName + " zIndex = " + zIn);
				/*if (i==0) { 
					document.getElementById(caName).style.pointerEvents = 'auto';
					if (caName=="Map_Canvas") {//(caName.indexOf("Map")>-1) {
						document.getElementById(caName).parentElement.parentElement.style.pointerEvents = 'auto';
						document.getElementById("addLandmark").disabled = '';
						}
						else document.getElementById("addLandmark").disabled = 'disabled';
					console.log(caName + " is active");
					}
				else {
					document.getElementById(caName).style.pointerEvents = 'none';
					if (caName.indexOf("Map")>-1)
						document.getElementById(caName).parentElement.parentElement.style.pointerEvents = 'none';
					}*/
				document.getElementById(caName).style.zIndex = zIn;
				if (caName.indexOf("Map")>-1)
						document.getElementById(caName).parentElement.parentElement.style.zIndex = zIn;
				zIn--;
				}	
		}
	});


	
//creates a form for submitting a post request to the DB and send the elements needed for editing the map
//https://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
/*function postform(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

	console.log("trying to insert a form");
    document.body.appendChild(form);
    form.submit();
}*/	

	
/*** Saves data for the session  **/

window.onbeforeunload = function(e) {

	var message = "Are you sure you want to leave this page? Any unsaved changes will be lost.";
	/*window.sessionStorage.setItem("dreammapTab","allowed");
	
	var mapDisplayLayers = document.getElementById("editables").innerHTML;
	window.sessionStorage.setItem("mapDisplayLayers",mapDisplayLayers);

	var canvasesOrder = document.getElementById("canvases").innerHTML;
	window.sessionStorage.setItem("canvasesOrder", canvasesOrder);
	
	var prov=document.formactive;
	checkedCanvas = 1; //TODO
	for (var i=0;i<prov.formactivechild.length;i++)
		if (prov.formactivechild[i].checked)
			checkedCanvas = i;
	window.sessionStorage.setItem("checkedCanvas",checkedCanvas);
	
	var geojsonParser = new ol.format.GeoJSON();
	var newplSource = new ol.source.Vector();
	var circleFeatureLayerStr="";
	playgroundSource.getFeatures().forEach(function(feature) {
		if (feature.getGeometry().getType() == "Circle") 
			circleFeatureLayerStr += "/" + feature.getId() + "::" +feature.getGeometry().getCenter() + "::" + feature.getGeometry().getRadius();
		else
			newplSource.addFeature(feature);
		});
	var vectorFeatureLayerStr = geojsonParser.writeFeatures(newplSource.getFeatures());
	newplSource.clear();
	//console.log("cercurile " + circleFeatureLayerStr);
	//console.log("vectorFeatureLayerStr " + vectorFeatureLayerStr);
	//var vectorFeatureLayerStr ='{"type":"Feature","id":9001,"geometry":{"type":"Circle","radius":10000,"coordinates":[-2596883.489164978,6162848.520507684]},"properties":null}';
	window.sessionStorage.setItem("vectorFeatureLayer",vectorFeatureLayerStr);
	//if (circleFeatureLayerStr.length>0)
	window.sessionStorage.setItem("circleFeatureLayer",circleFeatureLayerStr);
	
	var freeDrawings = free_drawing_canvas.toDataURL();//document.getElementById("Free_Drawing_Canvas");
	window.sessionStorage.setItem("freeDrawings",freeDrawings);
	
	//var frameApplied = frame_canvas.toDataURL();//document.getElementById("Free_Drawing_Canvas");
	var sel_o = document.getElementById("load_frame");
	var frameApplied = sel_o.options[sel_o.selectedIndex].value;
	
	window.sessionStorage.setItem("frameApplied",frameApplied);
	
	var zoomMap = map.getView().getZoom();
	window.sessionStorage.setItem("zoomMap",zoomMap);
	var centerMap = map.getView().getCenter();
	//var centerMap = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857','EPSG:4326');
	window.sessionStorage.setItem("centerMap",centerMap);
	
	if (document.getElementById("addCanvas").style.display=="none") { //map1
	
	var additionalMapDisplayLayers = document.getElementById("layersNewCanvas").innerHTML;
	window.sessionStorage.setItem("additionalMapDisplayLayers",additionalMapDisplayLayers);
	
	var zoomAdditionalMap = map1.getView().getZoom();
	window.sessionStorage.setItem("zoomAdditionalMap",zoomAdditionalMap);
	var centerAdditionalMap = map1.getView().getZoom();
	window.sessionStorage.setItem("centerAdditionalMap",centerAdditionalMap);
	}
	var dreamid='88194f1c-32ef-4b9e-a4fa-4aa2f87f73f7';
	dreamid = document.getElementsByTagName("body")[0].dataset.dreamuuidurl;
	//save all these elements into the database with post calling the servlet saveDreamMapToDB
	//create a new hidden form
	/*postform('https://dreams.ethz.ch/textpro_nou/saveDreamMapToDB', {freeDrawings:freeDrawings,frameApplied:frameApplied,vectorFeatureLayerJson:vectorFeatureLayerStr,circleFeatureLayerJson:circleFeatureLayerStr,mapDisplayLayers:mapDisplayLayers,canvasesOrder:canvasesOrder,checkedCanvas:checkedCanvas,zoomMap:zoomMap,centerMap:centerMap,additionalMapDisplayLayers:additionalMapDisplayLayers,zoomAdditionalMap:zoomAdditionalMap,centerAdditionalMap:centerAdditionalMap},"post");*/
	/*if (authorizeSave)
	sendpostrequest('https://dreams.ethz.ch/textpro/saveDreamMapToDB',"dreamUUID="+dreamid+"&freeDrawings="+ "should be the url of the saved image" +"&frameApplied="+ frameApplied +"&vectorFeatureLayer="+ vectorFeatureLayerStr+"&circleFeatureLayer="+circleFeatureLayerStr + "&mapDisplayLayers="+mapDisplayLayers+"&canvasesOrder="+canvasesOrder+"&checkedCanvas="+checkedCanvas+"&zoomMap="+zoomMap+"&centerMap="+centerMap+"&additionalMapDisplayLayers="+additionalMapDisplayLayers+"&zoomAdditionalMap="+zoomAdditionalMap+"&centerAdditionalMap="+centerAdditionalMap); */
    
	return message;
}



if (window.sessionStorage.dreamReport) {
	document.getElementById("dreamReport").innerHTML += window.sessionStorage.dreamReport;
	} else if (dataFromDB) document.getElementById("dreamReport").innerHTML += document.getElementsByTagName("body")[0].dataset.dreamreportdb;
if (window.sessionStorage.checkedLocations) {
	var checkboxes = window.sessionStorage.checkedLocations.split("hereidomycbbreak");
	var ki = 0;
	for (ki=0; ki<checkboxes.length;ki++) {
		var onecheckbox = checkboxes[ki].split("hereidomybreak");
		if (onecheckbox.length>1)
		switch (onecheckbox[0]) {
		 case "Center":
			var toExecCenter = " map.getView().setCenter(ol.proj.fromLonLat(";
			toExecCenter += onecheckbox[1]; // [lon, lat]
			toExecCenter += "));";
			//document.getElementById("dreamReport").innerHTML += toExecCenter;
			eval(toExecCenter);
			console.log("Map centered to " + onecheckbox[1]);
			break;
		case "Point": //on layer geojsonPlaces_V
			var geojsonobj = onecheckbox[1];
			var placename = onecheckbox[2];
			var ptype = "city";
			if (onecheckbox.length>3)
				ptype = onecheckbox[3];
		//create icons and add to source vector
			var iconFeature = new ol.Feature({
          		geometry: new ol.geom.Point(
					//ol.proj.transform([-81.6256713,43.4193879], 'EPSG:4326',   'EPSG:3857')),
					ol.proj.transform(eval(geojsonobj), 'EPSG:4326',   'EPSG:3857')),
        		name: placename,
				placetype: ptype
        });
		geojson_vectorSource.addFeature(iconFeature);

			/*var toExecCenter = " map.getView().setCenter(ol.proj.fromLonLat(";
			toExecCenter += onecheckbox[1]; // [lon, lat]
			toExecCenter += "));";
			document.getElementById("dreamReport").innerHTML += toExecCenter;
			eval(toExecCenter);*/
			break;
		case "MultiPolygon":
			//splitted into polygons
			var geojsonobj = onecheckbox[1];
			var placename = onecheckbox[2];
			var ptype = "city";
			if (onecheckbox.length>3)
				ptype = onecheckbox[3];
			var polygons = geojsonobj.split("hereidomypolygonbreak");
			for (var i=0; i<polygons.length-1;i++) { //length-1 because the string ends with the break word
				var polygon_json = polygons[i].split(",");
				var coord_pol = [];
				for (var j=0; j<polygon_json.length-1; j++) { //length -1 because there are 2 coords for each point, and the iterator increases afterwards as well
					coord_pol.push(ol.proj.transform([parseFloat(polygon_json[j]), parseFloat(polygon_json[j+1])], 'EPSG:4326', 'EPSG:3857')); 
					j++
				}
				
				var multipolygonFeature = new ol.Feature({
					geometry: new ol.geom.Polygon([coord_pol]),
					name: placename,
					placetype: ptype
					});
				geojson_vectorSource.addFeature(multipolygonFeature);
			}
			break;
		case "Polygon":
			var geojsonobj = onecheckbox[1].slice(1,onecheckbox[1].length-1);
			geojsonobj = geojsonobj.split(",");
			var coord_geojsonobj = []; 
			for (var i=0; i<geojsonobj.length-1; i++) { 
				coord_geojsonobj.push(ol.proj.transform([parseFloat(geojsonobj[i]), parseFloat(geojsonobj[i+1])], 'EPSG:4326', 'EPSG:3857'));
				i++;
				}
			var placename = onecheckbox[2];
			var ptype = "city";
			if (onecheckbox.length>3)
				ptype = onecheckbox[3];
			var polygonFeature = new ol.Feature({
          		geometry: new ol.geom.Polygon([coord_geojsonobj]),
        		name: placename,
				placetype: ptype
			});
			//new ol.format.GeoJSON()).readFeatures(geojsonObject);
			geojson_vectorSource.addFeature(polygonFeature);
			break;
		default: ;
		}
		
		}

	}
var mDiLa = "";
/*if (window.sessionStorage.mapDisplayLayers) { 
	mDiLa = window.sessionStorage.mapDisplayLayers;
	document.getElementById("editables").innerHTML = mDiLa;
	}
else */if (dataFromDB) { 
	mDiLa=mapdisplaylayersdb;
	//console.log("active layers from db: " + mDiLa);
	if (mDiLa.length>0)
	document.getElementById("editables").innerHTML = mDiLa;
	else
		document.getElementById("editables").innerHTML ='<li>playground_V <i class="fa fa-remove js-remove"></i></li>'
													+'<li>geojsonPlaces_V <i class="fa fa-remove js-remove"></i></li>'
													+'<li>stamenWatercolorG_R <i class="fa fa-remove js-remove"></i></li>';
	}
	
getMapLayersFromList(document.getElementById("editables"), map);


/*if (window.sessionStorage.canvasesOrder) {
	document.getElementById("canvases").innerHTML = window.sessionStorage.canvasesOrder;
	//console.log("iata ordinea "+window.sessionStorage.canvasesOrder);
	}  
else */if (dataFromDB) {
	if (canvasesorderdb.length>0) {
	document.getElementById("canvases").innerHTML = canvasesorderdb;
	if (canvasesorderdb.indexOf("dditional")>-1) {
		addCanvas();
		document.getElementById("layersNewCanvas").innerHTML = additionalmapdisplaylayersdb;
		getMapLayersFromList(document.getElementById("layersNewCanvas"), map1);

		map1.getView().setZoom(zoomadditionalmapdb);
		var coo1 = centeradditionalmapdb.split(",");
		map1.getView().setCenter([parseFloat(coo1[0]),parseFloat(coo1[1])]);
	
	}
	}
	//TODO
	document.getElementById("canvases").innerHTML = '<li><label for="orderDrawing"><input type="radio" id="orderDrawing" name="formactivechild" value="Free_Drawing_Canvas" onchange="setActiveCanvas(this)">'
													+'<img src="icons/pensula.svg" height="50" width="50" style="vertical-align:middle">'
													+'<span> Free Drawing</span></label></li>'
												+'<li><label for="orderFrame"><input type="radio" id="orderFrame" name="formactivechild" value="Frame_Canvas" onchange="setActiveCanvas(this)">'
												+'	<img src="icons/rama.svg" height="50" width="50" style="vertical-align:middle">'
												+'	<span> Frame</span></label></li>'
												+'<li draggable="false" class="" style=""><label for="orderMap"><input type="radio" id="orderMap" name="formactivechild" value="Map_Canvas" onchange="setActiveCanvas(this)" checked="">'
													+'<img src="icons/glob_jumate_points.svg" height="50" width="50" style="vertical-align:middle" draggable="false">'
													+'<span> Map</span></label></li>';
	//console.log("iata ordinea from db "+canvasesorderdb);
	}
	else{console.log("no order");}

/*if (window.sessionStorage.checkedCanvas) {	
   document.formactive[window.sessionStorage.checkedCanvas].checked=true;
   setActiveCanvas(document.getElementById(document.formactive[window.sessionStorage.checkedCanvas].id));
   //console.log("this is the active canvas (radio button checked): "+window.sessionStorage.checkedCanvas);
   }
   else */if (dataFromDB) {
   if (document.formactive[checkedcanvasdb]) {document.formactive[checkedcanvasdb].checked=true;
   setActiveCanvas(document.getElementById(document.formactive[checkedcanvasdb].id));}
   }
   else {
   //check which canvas is selected as active (radio) and set it active, at the first run
		var prov=document.formactive;
		var ccheckedCanvas = 1; //TODO
			for (var i=0;i<prov.formactivechild.length;i++)
				if (prov.formactivechild[i].checked)
					ccheckedCanvas = i;
		setActiveCanvas(document.getElementById(document.formactive[ccheckedCanvas].id));	
   }
/*if (window.sessionStorage.vectorFeatureLayerJson) {
	//console.log("iata geometriile "+window.sessionStorage.vectorFeatureLayerJson);
	//playgroundSource.clear();
	playgroundSource.addFeatures(new ol.format.GeoJSON().readFeatures(window.sessionStorage.vectorFeatureLayerJson));
	playgroundSource.getFeatures().forEach(function() { drawFeatureId++});
	}
	else */if (dataFromDB) if (vectorfeaturelayerdb>"") {
   playgroundSource.addFeatures(new ol.format.GeoJSON().readFeatures(vectorfeaturelayerdb));
	playgroundSource.getFeatures().forEach(function() { drawFeatureId++});
   }
	else console.log("no feature to load");

/*if (window.sessionStorage.circleFeatureLayerJson && window.sessionStorage.circleFeatureLayerJson.length>0) {
	//console.log("iata cercurile "+window.sessionStorage.circleFeatureLayerJson);
	var c_vect = window.sessionStorage.circleFeatureLayerJson.split("/");
	//circleFeatureLayerStr += "/" + feature.getId() + "::" +feature.getGeometry().getCenter() + "::" + feature.getGeometry().getRadius();
	for (var i=1; i<c_vect.length;i++) {
		var c_els = c_vect[i].split("::");
		//console.log("cerc"+c_els[0] + " " + c_els[1] + " " + c_els[2]);
		var coo = c_els[1].split(",");
		var c_geom = new ol.geom.Circle([parseFloat(coo[0]),parseFloat(coo[1])],parseFloat(c_els[2]));
		var c_feat = new ol.Feature({
			geometry: c_geom
		});
		c_feat.setId(c_els[0]);
		playgroundSource.addFeature(c_feat);
		drawFeatureId++;
		}
	//playgroundSource.clear();
	
	}
	else */if (dataFromDB) {
		if (circlefeaturelayerdb.length>0) {
			var c_vect = circlefeaturelayerdb.split("/");
			//circleFeatureLayerStr += "/" + feature.getId() + "::" +feature.getGeometry().getCenter() + "::" + feature.getGeometry().getRadius();
			for (var i=1; i<c_vect.length;i++) {
				var c_els = c_vect[i].split("::");
				//console.log("cerc"+c_els[0] + " " + c_els[1] + " " + c_els[2]);
				var coo = c_els[1].split(",");
				var c_geom = new ol.geom.Circle([parseFloat(coo[0]),parseFloat(coo[1])],parseFloat(c_els[2]));
				var c_feat = new ol.Feature({
					geometry: c_geom
				});
				c_feat.setId(c_els[0]);
				playgroundSource.addFeature(c_feat);
				drawFeatureId++;
				}
		}
	}
	else console.log("no circle");
	
/*if (window.sessionStorage.freeDrawings) {
	var elfd = document.getElementById("Free_Drawing_Canvas");
	var imgfd = new Image;
	imgfd.onload = function() {
		elfd.getContext("2d").drawImage(imgfd,0,0);
		
		}
	imgfd.src = window.sessionStorage.freeDrawings;
} 
	/*else if (dataFromDB) {
	var elfd = document.getElementById("Free_Drawing_Canvas");
	var imgfd = new Image;
	imgfd.onload = function() {
		elfd.getContext("2d").drawImage(imgfd,0,0);
		
		}
	imgfd.src = freedrawingsdb;
	}*/

/*if (window.sessionStorage.frameApplied) {
	document.getElementById("load_frame").value = window.sessionStorage.frameApplied;
	drawFrame();
	//var elfr = document.getElementById("Frame_Canvas");
	//var imgfr = new Image;
	//imgfr.onload = function() {
	//	elfr.getContext("2d").drawImage(imgfr,0,0);
	//	}
	//imgfr.src = window.sessionStorage.frameApplied;
}
	else */if (dataFromDB) {
		document.getElementById("load_frame").value = frameapplieddb;
		drawFrame();
	}

/*if (window.sessionStorage.zoomMap) {
	map.getView().setZoom(window.sessionStorage.zoomMap)
} else */if (dataFromDB && zoommapdb!="undefined") {map.getView().setZoom(zoommapdb)}

/*if (window.sessionStorage.centerMap) {
	var coo = window.sessionStorage.centerMap.split(",");
	map.getView().setCenter([parseFloat(coo[0]),parseFloat(coo[1])]);
	//map.getView().setCenter(ol.proj.transform([parseFloat(coo[0]),parseFloat(coo[1])],'EPSG:4326', 'EPSG:3857'));
} else */if (dataFromDB && centermapdb!="undefined") {
	if (centermapdb=="NaN,NaN") centermapdb="890555.9263461886,5621521.486192066";
	var coo = centermapdb.split(",");
	map.getView().setCenter([parseFloat(coo[0]),parseFloat(coo[1])]);
	}
	
if (dataFromDB) {
	//if ()
	//show image from server
	//calling servlet GetDreamImageFromServer
//sendpostrequest('https://dreams.ethz.ch/textpro/GetDreamImageFromServer',"dreamid="+dreamid+"&description=free_drawing_canvas");
}
	
/*var additionalmapdisplaylayersdb = document.getElementsByTagName("body")[0].dataset.additionalmapdisplaylayersdb;
if (window.sessionStorage.additionalMapDisplayLayers) {
	addCanvas(document.getElementById("addCanvas"));
	//console.log("active layers: " + window.sessionStorage.mapDisplayLayers);
	document.getElementById("layersNewCanvas").innerHTML = window.sessionStorage.additionalMapDisplayLayers;
	getMapLayersFromList(document.getElementById("layersNewCanvas"), map1);
	 
	//else {
	//console.log("additional map canvas has no layers");
	//getMapLayersFromList(document.getElementById("layersNewCanvas"), map1);
	//}
if (window.sessionStorage.zoomAdditionalMap) {
	map1.getView().setZoom(window.sessionStorage.zoomAdditionalMap)
}
if (window.sessionStorage.centerAdditionalMap) {
	var coo1 = window.sessionStorage.centerAdditionalMap.split(",");
	map1.getView().setCenter([parseFloat(coo1[0]),parseFloat(coo1[1])]);
}
} 
else if (dataFromDB && additionalmapdisplaylayersdb!="undefined") {
	//addCanvas(document.getElementById("addCanvas"));
	addCanvas();
	//console.log("active layers: " + window.sessionStorage.mapDisplayLayers);
	document.getElementById("layersNewCanvas").innerHTML = additionalmapdisplaylayersdb;
	getMapLayersFromList(document.getElementById("layersNewCanvas"), map1);

	map1.getView().setZoom(zoomadditionalmapdb);
	var coo1 = centeradditionalmapdb.split(",");
	map1.getView().setCenter([parseFloat(coo1[0]),parseFloat(coo1[1])]);
}*/
	
}, false); // end DOMContentLoaded listener





function saveDreamMapToServer() {
var dreamid = document.getElementsByTagName("body")[0].dataset.dreamuuidurl;
var sel_o = document.getElementById("load_frame");
	var frameApplied = sel_o.options[sel_o.selectedIndex].value;

	var geojsonParser = new ol.format.GeoJSON();
	var newplSource = new ol.source.Vector();
	var circleFeatureLayerStr="";
	playgroundSource.getFeatures().forEach(function(feature) {
		if (feature.getGeometry().getType() == "Circle") 
			circleFeatureLayerStr += "/" + feature.getId() + "::" +feature.getGeometry().getCenter() + "::" + feature.getGeometry().getRadius();
		else
			newplSource.addFeature(feature);
		});
	var vectorFeatureLayerStr = geojsonParser.writeFeatures(newplSource.getFeatures());
	newplSource.clear();
var mapDisplayLayers = document.getElementById("editables").innerHTML;
var canvasesOrder=document.getElementById("canvases").innerHTML;
var checkedCanvas;
var prov=document.formactive;
	checkedCanvas = 1; //TODO
	for (var i=0;i<prov.formactivechild.length;i++)
		if (prov.formactivechild[i].checked)
			checkedCanvas = i;
var zoomMap=map.getView().getZoom();
var centerMap = map.getView().getCenter();

var additionalMapDisplayLayers = "";
var zoomAdditionalMap ="";
var centerAdditionalMap="" 
if (document.getElementById("layersNewCanvas")) {
	additionalMapDisplayLayers =document.getElementById("layersNewCanvas").innerHTML;
	zoomAdditionalMap=map1.getView().getZoom();
	centerAdditionalMap=map1.getView().getCenter(); 
	}
sendpostrequest('https://dreams.ethz.ch/textpro/saveDreamMapToDB',"dreamUUID="+dreamid+"&frameApplied="+ frameApplied +"&vectorFeatureLayer="+ vectorFeatureLayerStr+"&circleFeatureLayer="+circleFeatureLayerStr + "&mapDisplayLayers="+mapDisplayLayers+"&canvasesOrder="+canvasesOrder+"&checkedCanvas="+checkedCanvas+"&zoomMap="+zoomMap+"&centerMap="+centerMap+"&additionalMapDisplayLayers="+additionalMapDisplayLayers+"&zoomAdditionalMap="+zoomAdditionalMap+"&centerAdditionalMap="+centerAdditionalMap); 


var newLa = document.createElement('canvas');
newLa.setAttribute("id","drawingMapCanvas");
newLa.style.display = "none";
newLa.setAttribute("width",frame_canvas.width);
newLa.setAttribute("height",frame_canvas.height);
var el = document.getElementById("savedImage");
el.appendChild(newLa);
var imagesaved = true;

var end_canvas=newLa.getContext('2d');		
	end_canvas.clearRect(0, 0, frame_canvas.width, frame_canvas.height);
	end_canvas.drawImage(eval(document.getElementById("Free_Drawing_Canvas")),0,0);
var end_canvas_drawing = document.getElementById('drawingMapCanvas');
var dataUrl = end_canvas_drawing.toDataURL();
var blob=dataURItoBlob(dataUrl);
var formData = new FormData();
formData.append("dreamUUID", dreamid);
/*newLa.toBlob(function(blob) {
	formData.append("blob",blob,"dream_"+dreamid+"_draw.png");
	//sendpostrequest('https://dreams.ethz.ch/textpro/SaveDreamImageToServer',"dreamUUID="+dreamid+"&blob="+blob);
	//saveAs(blob, 'myDreamMap' + dreamid + '.png');
	});*/
formData.append("blob",blob,"dreammap_draw_"+dreamid+".png");
var request = new XMLHttpRequest();
request.open("POST", "https://dreams.ethz.ch/textpro/SaveDreamImageToServer");
//request.setRequestHeader("Content-Type", 'multipart/form-data');
//request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

request.onreadystatechange = function() {//Call a function when the state changes.
    if(request.readyState == 4 && request.status == 200) {
		console.log("http response: " + request.responseText);
		if (request.responseText=="image saved")
			imagesaved=true;
		//alert(request.responseText);
    }
}
request.send(formData);
	


//if (imagesaved)
document.getElementById("feedbackSaved").innerHTML = "map saved to server";
} 

function saveDreamImageToServer() {
var dreamid = document.getElementsByTagName("body")[0].dataset.dreamuuidurl;
var newLa = document.createElement('canvas');
newLa.setAttribute("id","drawingMapCanvas");
newLa.style.display = "none";
newLa.setAttribute("width",frame_canvas.width);
newLa.setAttribute("height",frame_canvas.height);
var imagesaved = true;
var end_canvas=newLa.getContext('2d');		
	end_canvas.clearRect(0, 0, frame_canvas.width, frame_canvas.height);
var itemEl = document.getElementById('canvases');
var listEls = itemEl.getElementsByTagName("span");
var j = listEls.length;
for (var i=0; i<listEls.length; i++) { //itemEl.children.length
	j--;
	var caName = listEls[j].innerHTML; //itemEl.children
	caName = caName.substring(caName.indexOf(">")+2,caName.length);
	caName = caName.split(" ").join("_") + "_Canvas";
	//console.log("am desenat "+caName + " 5" + caName.toLocaleLowerCase());				
	end_canvas.drawImage(eval(document.getElementById(caName)),0,0);
	}
var dataUrl = newLa.toDataURL();
var blob=dataURItoBlob(dataUrl);
var formData = new FormData();
formData.append("dreamUUID", dreamid);
//newLa.toBlob(function(blob) {
	formData.append("blob",blob,"dreammap_"+dreamid+".png");
	//});


var request = new XMLHttpRequest();
request.open("POST", "https://dreams.ethz.ch/textpro/SaveDreamImageToServer");
//request.setRequestHeader("Content-Type", 'multipart/form-data');
//request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

request.onreadystatechange = function() {//Call a function when the state changes.
    if(request.readyState == 4 && request.status == 200) {
		console.log("http response: " + request.responseText);
		if (request.responseText=="image saved")
			imagesaved=true;
		//alert(request.responseText);
    }
}
request.send(formData);
document.getElementById("feedbackSaved").innerHTML = "image saved to server";
}

//https://stackoverflow.com/questions/51716591/how-to-convert-a-canvas-image-to-a-buffered-image-for-servlet-processing
function dataURItoBlob(dataURI)
{
    var aDataURIparts = dataURI.split(','),
        binary = atob(aDataURIparts[1]),
        mime = aDataURIparts[0].match(/:(.*?);/)[1],
        array = [],
        n = binary.length,
        u8arr = new Uint8Array(n);

    while(n--)
        u8arr[n] = binary.charCodeAt(n);

    return new Blob([u8arr], {type: mime})
}

/*//https://stackoverflow.com/questions/18253378/javascript-blob-upload-with-formdata
function dataURItoBlob(dataURI)
{
    var byteString = atob(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { "type": mimeString });
    return bb;
}*/

function saveDreamMap() {
var el = document.getElementById("savedImage");
/*
var dataURL = free_drawing_canvas.toDataURL();
document.getElementById("canvasImg").src = dataURL;
var newLa = document.createElement('p');
newLa.innerHTML = "&nbsp;&nbsp;This is your saved image.";
el.appendChild(newLa);*/

var newLa = document.createElement('canvas');
newLa.setAttribute("id","endMapCanvas");
newLa.style.display = "none";
newLa.setAttribute("width",frame_canvas.width);
newLa.setAttribute("height",frame_canvas.height);
el.appendChild(newLa);

var end_canvas=newLa.getContext('2d');

var itemEl = document.getElementById('canvases');
var listEls = itemEl.getElementsByTagName("span");
var j = listEls.length;
for (var i=0; i<listEls.length; i++) { //itemEl.children.length
	j--;
	var caName = listEls[j].innerHTML; //itemEl.children
	caName = caName.substring(caName.indexOf(">")+2,caName.length);
	caName = caName.split(" ").join("_") + "_Canvas";
	//console.log("am desenat "+caName + " 5" + caName.toLocaleLowerCase());				
	end_canvas.drawImage(eval(document.getElementById(caName)),0,0);
	}

var d = new Date();
newLa.toBlob(function(blob) {
	saveAs(blob, 'myDreamMap' + d.toLocaleString() + '.png');
	});

}	

//http://openlayers.org/en/latest/examples/export-map.html
function downloadPng() {
  console.log("intrasi aici");
  map.once('postcompose', function(event) {
    var canvas = event.context.canvas;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
    } else {
      canvas.toBlob(function(blob) {
        saveAs(blob, 'map.png');
      });
    }
  });
  map.renderSync();
}

/*var http = new XMLHttpRequest();
var url = 'get_data.php';
var params = 'orem=ipsum&name=binny';
http.open('POST', url, true);

//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
    }
}
http.send(params);*/
function sendpostrequest(path, params) {
parms = encodeURI(params);
//console.log("params after encoding:" + params);
var http = new XMLHttpRequest();
http.open('POST', path, true);
//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        console.log("http response: " + http.responseText);
		//alert(http.responseText);
    }
}
http.send(params);
}

