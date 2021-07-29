/*****
* @author Cristina M. Iosifescu Enescu <ciosifescu@ethz.ch>
* Project Dream Cartography
* @copyright Institute of Cartography and Geoinformation, ETH Zurich, Switzerland
* Last modified: feb 28, 2018
*
*/

//add hovering to the special created icon for dreammap
//add also the item 
//<li><a href="DIYdreammap.html"><img id="dreammap_icon" src="images/adjust_map_galben.svg" onmouseover="hover(this);" onmouseout="unhover(this);"/></a></li>
//to the other html files
function hover(element) {
	element.setAttribute('src', 'images/adjust_map_alb.svg');
}
function unhover(element) {
	element.setAttribute('src', 'images/adjust_map_mov_pal.svg');
}
function verifyMapTab() {
	if (window.sessionStorage.dreammapTab && !document.getElementById("dreammap_icon")) {
		var ul = document.getElementById("nav").getElementsByTagName("ul")[0];
		var el = document.createElement("li");
		el.innerHTML='<a href="DIYdreammap.jsp"><img id="dreammap_icon" src="images/adjust_map_mov_pal.svg" onmouseover="hover(this);" onmouseout="unhover(this);"/></a>';
		//var lis = ul.getElementsByTagName("li");
		ul.insertBefore(el,ul.lastChild);
		}
}

//source: https://www.w3schools.com/howto/howto_js_accordion.asp
function initAccordion() {
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}
}
function toggle(id) {
    var el = document.getElementById(id);
    var img = document.getElementById("arrow");
    var box = el.getAttribute("class");
    if(box == "hide"){
        el.setAttribute("class", "show");
        delay(img, "images/adjust_map_mov.svg", 400);
    }
    else{
        el.setAttribute("class", "hide");
        delay(img, "images/adjust_map_mov.svg", 400);
    }
}

function delay(elem, src, delayTime){
    window.setTimeout(function() {elem.setAttribute("src", src);}, delayTime);
}

