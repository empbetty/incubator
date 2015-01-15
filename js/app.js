var cost = 0;
var PCM = {};
var selection = {};
var matnum = 0;

// clear memory and store element
function begin() {
    localStorage.clear();
    PCM["PCM1"] = document.getElementById("PCM1");
    PCM["PCM2"] = document.getElementById("PCM2");
    PCM["PCM3"] = document.getElementById("PCM3");
    PCM["PCM4"] = document.getElementById("PCM4");
    PCM["CL"] = document.getElementById("CL");
}

// functions for drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var imageToReplace = document.getElementById(ev.target.id);
    var newimage = document.getElementById(data).cloneNode();
    var containerId = ev.target.parentNode.id.slice(0, ev.target.parentNode.id.length-9);
    if (newimage.getAttribute("class") == imageToReplace.getAttribute("class")) {
    	newimage.setAttribute("draggable", "false");
		ev.target.parentNode.replaceChild(newimage, ev.target.parentNode.childNodes[1]);
		cost = cost - calcCost(imageToReplace.getAttribute("id")) + calcCost(newimage.getAttribute("id"));
        document.getElementById("cost").innerHTML = cost;
        selection[containerId] = newimage.id;
        matnum = matnum + 1;
        console.log(matnum);
    }
}

// double click to cancel selection
function cancelSelection(ev) {
    var nowimage = document.getElementById(ev.target.id);
    var containerId = ev.target.parentNode.id.slice(0, ev.target.parentNode.id.length-9);
    var PCMimg = PCM[containerId];
    if (PCMimg != nowimage) {
        ev.target.parentNode.replaceChild(PCMimg, ev.target.parentNode.childNodes[1]);
        cost = cost - calcCost(nowimage.getAttribute("id"));
        document.getElementById("cost").innerHTML = cost;
        delete selection[containerId];
        matnum = matnum - 1;
        console.log(matnum);
    }

}

// cost calculation
function calcCost(material) {
    if (material == "PW") {
        return 20;
    } else if (material == "SA") {
        return 13;
    } else if (material == "FU") {
        return 8;
    } else if (material == "WP") {
        return 20;
    } else if (material == "nylon") {
        return 5;
    } else if (material == "cotton") {
        return 12;
    } else {
        return 0;
    }
}

// store selection to the use of next page
function store() {
    if (selection["CL"] == undefined) {
        window.alert("Need to choose an insulation layer!");
    } else if (matnum < 4) {
        window.alert("You must choose 3 or more PCMs to operate the incubator");
    } else {
        self.location = "test.html";
        localStorage.setItem("cost", cost);
        localStorage.setItem("selection", JSON.stringify(selection));
    }
}

// click to show info of the material
function showinfo(ev){
    var id = ev.target.id;
    var image = document.getElementById("info" + id);
    if (image == null) {
        image = document.getElementById(id);
    }
    if (image.style.visibility=='visible'){
        image.style.visibility='hidden';
    } else {
        image.style.visibility='visible';
    }
    
}