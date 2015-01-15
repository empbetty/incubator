var num36 = 0;
var num39 = 0;
var numFU = 0;
var plot;
var baby_temp;
var p;



// Define PCM Temperature Curves
function pcm_36(T) {
    var t = T % 400.00;
    if (t >= 0 && t < 6.17263) {
      return 40 - 0.648022 * t;
    } else if (t >= 6.17263 && t < 335.857) {
      return 36.0;
    } else if (t >= 335.857 && t < 346.659) {
      return 36 - 0.277724 * (-335.857 + t);
    } else {
      return 33.0;
    }
}

function pcm_39(T) {
    var t = T % 85.00;
    if (t >= 0 && t < 1.18) {
      return 40.0 - 0.845542 * t;
    } else if (t >= 1.18 && t < 66.4428) {
      return 39.0;
    } else if (t >= 66.4428 && t < 74.7216) {
      return 39.0 - 0.72475 * (-66.4428 + t);
    } else {
      return 33.0;
    }
}

function pcm_37(T) {
    var t = T % 215.00;
    if (t >= 0 && t < 4.39507) {
      return 40 - 0.682583 * t;
    } else if (t >= 4.39507 && t < 175.315) {
      return 37.0;
    } else if (t >= 175.315 && t < 192.748) {
      return 37 - 0.22944 * (-175.315 + t);
    } else {
      return 33.0;
    }
}

// Define average temperature from total PCM contributions
function totalPCM(t){
  return (num39 * pcm_39(t) +  numFU * pcm_37(t) + num36 * pcm_36(t)) / (num39 + numFU + num36);
}

function testbegin() {
  var selection = JSON.parse(localStorage.getItem("selection"));
  document.getElementById("speccost").innerHTML = localStorage.getItem("cost");
  var selectionCL = selection["CL"];
  if (selectionCL == undefined) {
    document.getElementById("specCL").innerHTML = "water";
  } else if (selectionCL == "WP") {
    var specCL = document.getElementById("specCL");
    specCL.style.fontSize = "11px";
    specCL.style.height = "27px";
    specCL.style.top = "10px";
    specCL.innerHTML = "Water Pouch"
  } else {
    document.getElementById("specCL").innerHTML = selectionCL;
  }

// Set Heating to dotted lines, cooling times to solid lines 
  var Points39 = [];
  for (j=0; j<=720/85; j++){
    var set = [];
    for (i=0; i<85; i++) {
      set.push([j*85+i, pcm_39(j*85+i)]);
    }
    Points39.push(set);
  }

  var Dots39 = [];
  for (j=0; j<=720/85; j++){
    var set = [];
    for (i=84; i<=85; i++) {
      set.push([j*85+i, pcm_39(j*85+i)]);
    }
    Dots39.push(set);
  }

  var Points36 = [];
  for (j=0; j<=720/400; j++) {
    var set = [];
    for (i=0; i<400; i++) {
      set.push([j*400+i, pcm_36(j*400+i)]);
    }
    Points36.push(set);
  }

  var Dots36 = [];
  for (j=0; j<=720/400; j++) {
    var set = [];
    for (i=399; i<=400; i++) {
      set.push([j*400+i, pcm_36(j*400+i)]);
    }
    Dots36.push(set);
  }

  var PointsFU = [];
  for (j=0; j<=720/215; j++) {
    var set = [];
    for (i=0; i<215; i++) {
      set.push([j*215+i, pcm_37(j*215+i)]);
    }
    PointsFU.push(set);
  }

  var DotsFU = [];
  for (j=0; j<=720/215; j++) {
    var set = [];
    for (i=214; i<=215; i++) {
      set.push([j*215+i, pcm_37(j*215+i)]);
    }
    DotsFU.push(set);
  }

  // Determine which pouches are in use

  window["PCM1Series"] = [];
  window["PCM2Series"] = [];
  window["PCM3Series"] = [];
  window["PCM4Series"] = [];
  window["PCM1Color"] = [];
  window["PCM2Color"] = [];
  window["PCM3Color"] = [];
  window["PCM4Color"] = [];

  for(var i = 1; i < 5; i++) {
    if (selection["PCM" + i] == "PW") {
      num36++;
      window["PCM" + i + "Points"] = Points36;
      window["PCM" + i + "Dots"] = Dots36;
      for (j = 0; j < window["PCM" + i + "Points"].length; j++) {
        (window["PCM" + i + "Series"]).push({});
        (window["PCM" + i + "Color"]).push("yellow");
      }
      for (j = 0; j < window["PCM" + i + "Dots"].length; j++) {
        (window["PCM" + i + "Series"]).push({linePattern:'dotted'});
        (window["PCM" + i + "Color"]).push("yellow");
      }
    } else if (selection["PCM" + i] == "SA") {
      num39++;
      window["PCM" + i + "Points"] = Points39;
      window["PCM" + i + "Dots"] = Dots39;
      for (j = 0; j < window["PCM" + i + "Points"].length; j++) {
        (window["PCM" + i + "Series"]).push({});
        (window["PCM" + i + "Color"]).push("red");
      }
      for (j = 0; j < window["PCM" + i + "Dots"].length; j++) {
        (window["PCM" + i + "Series"]).push({linePattern:'dotted'});
        (window["PCM" + i + "Color"]).push("red");
      }
    } else if (selection["PCM" + i] == "FU") {
      numFU++;
      window["PCM" + i + "Points"] = PointsFU;
      window["PCM" + i + "Dots"] = DotsFU;
      for (j = 0; j < window["PCM" + i + "Points"].length; j++) {
        (window["PCM" + i + "Series"]).push({});
        (window["PCM" + i + "Color"]).push("blue");
      }
      for (j = 0; j < window["PCM" + i + "Dots"].length; j++) {
        (window["PCM" + i + "Series"]).push({linePattern:'dotted'});
        (window["PCM" + i + "Color"]).push("blue");
      }
    } else {
      window["PCM" + i + "Points"] = [[null]];
      window["PCM" + i + "Dots"] = [[null]];
      for (j = 0; j < window["PCM" + i + "Points"].length; j++) {
        (window["PCM" + i + "Series"]).push({});
        (window["PCM" + i + "Color"]).push("black");
      }
      for (j = 0; j < window["PCM" + i + "Dots"].length; j++) {
        (window["PCM" + i + "Series"]).push({linePattern:'dotted'});
        (window["PCM" + i + "Color"]).push("black");
      }
    }
  }

  // Set insulating layer conductivity
  if (selection["CL"] == "nylon") {
    p = 0.13;
  } else {
    p = 0.04;
  }

  // Calculate the baby's temperature response
  baby_temp = [[0, 33.0]];
  var green=0, yellow=0, red=0;
  for (i=0; i<=720; i++) {
    baby_temp.push([i, baby_temp[baby_temp.length-1][1] + (totalPCM(i) - baby_temp[baby_temp.length-1][1]) * p]);
    if (baby_temp[baby_temp.length-1][1] >= 36.5 && baby_temp[baby_temp.length-1][1] <= 37.5){   
      green += 1;
    } else if (baby_temp[baby_temp.length-1][1] > 37.5 && baby_temp[baby_temp.length-1][1] <= 38.5){
      yellow += 1;
    } else if (baby_temp[baby_temp.length-1][1] >= 35.5 && baby_temp[baby_temp.length-1][1] < 36.5) {
      yellow += 1;
    } else if (baby_temp[baby_temp.length-1][1] > 38.5 && baby_temp[baby_temp.length-1][1] <= 40) {
      red += 1;
    } else if (baby_temp[baby_temp.length-1][1] >= 33 && baby_temp[baby_temp.length-1][1] < 34) {
      red += 5;
    } else if (baby_temp[baby_temp.length-1][1] >= 34 && baby_temp[baby_temp.length-1][1] <= 35) {
      red += 2;
    } else {
      red += 1
    }
  }
  
  // Determine the Safety Rating
  var greenhours = Math.trunc(green / 60);
  var greenminutes = green % 60;
  var yellowpercent = yellow / 7.21;
  var redpercent = red / 7.21;
  var safety = (100 - (0.5 * yellowpercent + 1 * redpercent))/10;

  document.getElementById("specPW").innerHTML = (num39/4)*100;
  document.getElementById("specSA").innerHTML = (num36/4)*100;
  document.getElementById("specFU").innerHTML = (numFU/4)*100;
  document.getElementById("resulttime").innerHTML = greenhours + " hr " + greenminutes + " min ";
  document.getElementById("resultrating").innerHTML = Math.round(safety * 100) / 100;

  // plot
  plot = $.jqplot('chart', PCM1Points.concat(PCM1Dots).concat(PCM2Points).concat(PCM2Dots).concat(PCM3Points).concat(PCM3Dots).concat(PCM4Points).concat(PCM4Dots).concat([baby_temp]),  
  { 
    title:'Temperatures at Baby and PCMs',
    seriesColors:PCM1Color.concat(PCM2Color).concat(PCM3Color).concat(PCM4Color).concat("black"),
    seriesDefaults:{
      showMarker: false,
      rendererOptions: {
        smooth: true
      }
    },
    axes: {
      xaxis: {
        min:0,
        max:720,
        numberTicks: 13,
        label:'Time (720 minutes)'
      },
      yaxis: {
        min:33,
        max:40,
        numberTicks: 8,
        label:'Temp (˚C)'
      }
    },
    series:PCM1Series.concat(PCM2Series).concat(PCM3Series).concat(PCM4Series).concat({}),
    canvasOverlay: {
      show: true,
      objects: [{
        line:{
          start: [12,33],
          stop: [12,34],
          lineWidth:2000,
          color:'rgba(255,0,0,0.3)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,34],
          stop: [12,35],
          lineWidth:2000,
          color:'rgba(255,0,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,35],
          stop: [12,35.5],
          lineWidth:2000,
          color:'rgba(255,0,0,0.1)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,35.5],
          stop: [12,36.5],
          lineWidth:2000,
          color:'rgba(255,255,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,36.5],
          stop: [12,37.5],
          lineWidth:2000,
          color:'rgba(0,255,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,37.5],
          stop: [12,38.5],
          lineWidth:2000,
          color:'rgba(255,255,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,38.5],
          stop: [12,40],
          lineWidth:2000,
          color:'rgba(255,0,0,0.1)',
          shadow: false,
          lineCap : 'butt'
        }
      }]
    }  
  });    
}

// function for checkbox
function check() {
  var selection = JSON.parse(localStorage.getItem("selection"));
  var PCMPoints = [];
  var PCMSeries = [];
  var PCMColor = [];
  for (i = 1; i < 5; i++) {
    if (document.getElementById("PCM" + i + "Cb").checked) {
      PCMPoints = PCMPoints.concat(window["PCM" + i + "Points"]).concat(window["PCM" + i + "Dots"]);
      PCMSeries = PCMSeries.concat(window["PCM" + i + "Series"]);
      PCMColor = PCMColor.concat(window["PCM" + i + "Color"]);
    }
  }

  if (document.getElementById("BabyCb").checked) {
    PCMPoints = PCMPoints.concat([baby_temp]);
    PCMSeries = PCMSeries.concat({});
    PCMColor = PCMColor.concat("black");
  }
  document.getElementById('chart').innerHTML=""; 
  plot = $.jqplot('chart', PCMPoints,
  {
    title:'Temperatures at Baby and PCMs',
      seriesColors:PCMColor,
      seriesDefaults:{
        showMarker: false,
        rendererOptions: {
          smooth: true
        }
      },
    axes: {
      xaxis: {
        min:0,
        max:720,
        numberTicks: 13,
        label:'Time (12 hours)'
      },
      yaxis: {
        min:33,
        max:40,
        numberTicks: 8,
        label:'Temp (˚C)'
      }
    },
 
 // Create red/yellow/green zones for easy visualization
    series:PCMSeries,
    canvasOverlay: {
      show: true,
      objects: [{
        line:{
          start: [12,33],
          stop: [12,34],
          lineWidth:2000,
          color:'rgba(255,0,0,0.3)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,34],
          stop: [12,35],
          lineWidth:2000,
          color:'rgba(255,0,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,35],
          stop: [12,35.5],
          lineWidth:2000,
          color:'rgba(255,0,0,0.1)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,35.5],
          stop: [12,36.5],
          lineWidth:2000,
          color:'rgba(255,255,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,36.5],
          stop: [12,37.5],
          lineWidth:2000,
          color:'rgba(0,255,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,37.5],
          stop: [12,38.5],
          lineWidth:2000,
          color:'rgba(255,255,0,0.2)',
          shadow: false,
          lineCap : 'butt'
        }
      },{
        line:{
          start: [12,38.5],
          stop: [12,40],
          lineWidth:2000,
          color:'rgba(255,0,0,0.1)',
          shadow: false,
          lineCap : 'butt'
        }
      }]
    }  
  });
}

// return to design page
function endfunc() {
  if (confirm("Are you sure you would like to reset? Please record your design specifications if you don't want them lost") == true) {
    self.location = "index.html";
  }
}