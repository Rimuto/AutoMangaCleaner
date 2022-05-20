$(function() {
$(document).ready(function() {
    const element = document.getElementById('panzoom')
    panzoom(element, {
        maxZoom: 10,
        minZoom: 0.1,
        zoomDoubleClickSpeed: 1,
        onDoubleClick: function(e) {
            return false;
         },
        beforeMouseDown: function(e) {
            //canvas.isDrawingMode = !canvas.isDrawingMode;
            var shouldIgnore = !e.altKey;
              return shouldIgnore;
        },
        afterMouseDown: function(e) {
            //canvas.isDrawingMode = !canvas.isDrawingMode;
        }
    });
});
function adjustTheme() {
    $("#theme-stylesheet").attr("href", "css/dark_theme.css");
}
$("#theme_chng").click(function() {
    adjustTheme();
});


function dragElement(element, direction)
{
    var   md; // remember mouse down info
    const first  = document.getElementById("menu");
    const second = document.getElementById("content");

    element.onmousedown = onMouseDown;

    function onMouseDown(e)
    {
        //console.log("mouse down: " + e.clientX);
        md = {e,
              offsetLeft:  element.offsetLeft,
              offsetTop:   element.offsetTop,
              firstWidth:  first.offsetWidth,
              secondWidth: second.offsetWidth
             };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            //console.log("mouse up");
            document.onmousemove = document.onmouseup = null;
        }
    }

    function onMouseMove(e)
    {
        //console.log("mouse move: " + e.clientX);
        var delta = {x: e.clientX - md.e.clientX,
                     y: e.clientY - md.e.clientY};

        if (direction === "H" ) // Horizontal
        {
            // Prevent negative-sized elements
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                       md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        }
    }
}
dragElement(document.getElementById("separator"), "H");

// This demo binds to shift + wheel


//var wheelTimeoutHandler = null;
//var wheelTimeout = 250; //ms;
/*function zoomWithWheel(event) {
    panzoom.zoomWithWheel(event)
    clearTimeout(wheelTimeoutHandler);
    wheelTimeoutHandler = setTimeout(function() {
        canvas.style.transform = "scale("+1/panzoom.getScale()+")"
        if (pdfDoc)
            renderPage(panzoom.getScale());
    }, wheelTimeout)
};
var element = document.getElementById('panzoom');
const panzoom = Panzoom(element, {
	bound:'outer',
	excludeClass: 'textblck',
	beforeMouseDown: function(e){
            // allow mouse-down panning only if altKey is down. Otherwise - ignore
            var shouldIgnore = !e.altKey;
            return shouldIgnore;
        }
});*/

/*var panzoom = panzoom(element,{
    beforeMouseDown: function(e){
            // allow mouse-down panning only if altKey is down. Otherwise - ignore
            var shouldIgnore = !e.altKey;
            return shouldIgnore;
        }
});*/
//element.parentElement.addEventListener('wheel', zoomWithWheel)
var ctrlDown = false,
    ctrlKey = 17,
    cmdKey = 91,
    vKey = 86,
    cKey = 67,
    altKey = 18,
    isDraw = false;
var id = 0;
var length = 0;
var selected_div;
var canvas = new fabric.Canvas("canvas", {freeDrawingCursor: 'none'});
var cursor = new fabric.StaticCanvas("cursor");


const STEP = 1;
var Direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3
};

fabric.util.addListener(document.body, 'keydown', function (options) {
    if (options.repeat) {
        return;
    }
    var key = options.which || options.keyCode; // key detection
    if (key === 37) { // handle Left key
        options.preventDefault();
        moveSelected(Direction.LEFT);
    } else if (key === 38) { // handle Up key
        options.preventDefault();
        moveSelected(Direction.UP);
    } else if (key === 39) { // handle Right key
        options.preventDefault();
        moveSelected(Direction.RIGHT);
    } else if (key === 40) { // handle Down key
        options.preventDefault();
        moveSelected(Direction.DOWN);
    }
});

function moveSelected(direction) {
    var activeObject = canvas.getActiveObject();
    var activeGroup = canvas.getActiveGroup;

    if (activeObject) {
        switch (direction) {
        case Direction.LEFT:
            activeObject.left = (activeObject.left - STEP);
            break;
        case Direction.UP:
            activeObject.top = (activeObject.top - STEP);
            break;
        case Direction.RIGHT:
            activeObject.left = (activeObject.left + STEP);
            break;
        case Direction.DOWN:
            activeObject.top = (activeObject.top + STEP);
            break;
        }
        activeObject.setCoords();
        canvas.renderAll();
        console.log('selected objects was moved');
    } else if (activeGroup) {
        switch (direction) {
        case Direction.LEFT:
            activeGroup.left = (activeGroup.left - STEP);
            break;
        case Direction.UP:
            activeGroup.top = (activeGroup.top - STEP);
            break;
        case Direction.RIGHT:
            activeGroup.left = (activeGroup.left + STEP);
            break;
        case Direction.DOWN:
            activeGroup.top = (activeGroup.top + STEP);
            break;
        }
        activeGroup.setCoords();
        canvas.renderAll();
        console.log('selected group was moved');
    } else {
        console.log('no object selected');
    }
}

canvas.on('text:selection:changed', onSelectionChanged);

/*
canvas.on('mouse:down', function(opt) {
  var evt = opt.e;
  if (evt.altKey === true) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
});
canvas.on('mouse:move', function(opt) {
  if (this.isDragging) {
    var e = opt.e;
    var vpt = this.viewportTransform;
    vpt[4] += e.clientX - this.lastPosX;
    vpt[5] += e.clientY - this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
});
canvas.on('mouse:up', function(opt) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
});
canvas.on('mouse:wheel', function(opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
*/


$( "#delete" ).click(function() {
    let activeObject = canvas.getActiveObjects();
    if (activeObject.length > 0) {
        let objectsInGroup = activeObject;
        canvas.discardActiveObject();
        objectsInGroup.forEach(function(object) {
        canvas.remove(object);
      });
    }
});

canvas.on('selection:updated', function(options) {
    let activeObject = canvas.getActiveObjects();
    $('#angle').val(activeObject[0].angle);
});
canvas.on('selection:created', function(options) {
    let activeObject = canvas.getActiveObjects();
    $('#angle').val(activeObject[0].angle);
});
canvas.on('object:rotating', function(options) {
    let activeObject = canvas.getActiveObjects();
    $('#angle').val(activeObject[0].angle);

    //console.log($('#text-font-size').val());
});

$("#add").click(function() {
    var text = new fabric.Textbox('A Computer Science Portal',
    {
        cornerSize: 10,
        lockScalingY: true,
        lockUniScaling: true,
        width: 300,
        left: 200,
        top: 50,
        fontSize: 21,
        originX: "center",
        originY: "center"
    });
    canvas.add(text);
    canvas.renderAll();
});

$("#toFront").click(function(){
    var activeObj = canvas.getActiveObject();
    activeObj && canvas.bringToFront(activeObj).discardActiveObject(activeObj).renderAll();
});

$("#lineHeight").on("input", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'lineHeight', $("#lineHeight").val());
    canvas.renderAll();
  }
});


$("#angle").on("input", function() {
  if (canvas.getActiveObjects().length > 0){
    canvas.getActiveObject().set("angle", $("#angle").val());
    canvas.renderAll();
    }
});

var fonts = ["Courier", "Arial", "Times New Roman", "Comic Sans MS", "Montez", "Lobster", "Josefin Sans","Shadows Into Light","Pacifico","Amatic SC", "Orbitron", "Rokkitt","Righteous","Dancing Script","Bangers","Chewy","Sigmar One","Architects Daughter","Abril Fatface","Covered By Your Grace","Kaushan Script","Gloria Hallelujah","Satisfy","Lobster Two","Comfortaa","Cinzel","Courgette"];
var string = "";
var select = document.getElementById("font-family")
const fontInput = document.getElementById("font-input"),
test = document.getElementById("test");
var font_cntr = 0
let font;

fontInput.addEventListener("input", async () => {
  const data = await fontInput.files[0].arrayBuffer();
  font = new FontFace('test-font' + font_cntr, data);
  await font.load();
  document.fonts.add(font);
  var opt = document.createElement('option');
    opt.classList.add("option");
    opt.value = opt.innerHTML = "test-font" + font_cntr;
    opt.style.fontFamily = "test-font" + font_cntr;
    select.insertBefore(opt, select.firstChild);
    font_cntr = font_cntr + 1;
});

for(var a = 0; a < fonts.length ; a++){
	var opt = document.createElement('option');
	opt.classList.add("option");
	opt.value = opt.innerHTML = fonts[a];
	opt.style.fontFamily = fonts[a];
	select.add(opt);
}

$("#group").on('click', function() {
    var activeObj = canvas.getActiveObject();
    if (activeObj){
        var activegroup = activeObj.toGroup();
        var objectsInGroup = activegroup.getObjects();

        activegroup.clone(function(newgroup) {
            canvas.remove(activegroup);
            objectsInGroup.forEach(function(object) {
                canvas.remove(object);
            });
//            newgroup.set({
//                originX: "center",
//                originY: "center"
//            });
            canvas.add(newgroup);
        });
    }
});

$("#ungroup").click(function(){
    var activeObject = canvas.getActiveObject();
    if (activeObject){
        if(activeObject.type=="group"){
            var items = activeObject._objects;
            activeObject._restoreObjectsState();
            canvas.remove(activeObject);
            for(var i = 0; i < items.length; i++) {
              if (items[i].get('type') == "textbox"){
                    items[i].set({
                    lockScalingY: true,
                    lockUniScaling: true
                  });
              }
              canvas.add(items[i]);
              canvas.item(canvas.size()-1).hasControls = true;
            }
            canvas.renderAll();
        }
    }
});

$("#mk-bg").click(function(){
    var activeObject = canvas.getActiveObject();
    if(confirm("Это дйествие не обратимо! Все выделенные объекты станут частью фона. Выполнить?")){
        if(activeObject){
            if(activeObject.type=="group"){
                activeObject.set({
                    selectable: false
                });
            }
            else if(activeObject._objects){
                var items = activeObject._objects;
                for(var i = 0; i < items.length; i++) {
                    items[i].set({
                        selectable: false
                    });
                }
            }
            else{
                activeObject.set({
                    selectable: false
                });
            }
            canvas.discardActiveObject().renderAll();
        }
    }
});

$("#fix").click(function(){
    var activeObject = canvas.getActiveObject();
    if(activeObject){
        activeObject.set({
            lockMovementX: !activeObject.get('lockMovementX'),
            lockMovementY: !activeObject.get('lockMovementY'),
            lockScalingX: !activeObject.get('lockScalingX'),
            lockScalingY: !activeObject.get('lockScalingY'),
        });
        canvas.renderAll();
    }
});

$("#apply-font").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'fontFamily', $("#font-family").val());
    canvas.renderAll();
  }
});

$("#font-family").on("change", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'fontFamily', $("#font-family").val());
    canvas.renderAll();
  }
});

$("#text-color").on("input", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'fill', $("#text-color").val());
    canvas.renderAll();
  }
});


$("#text-font-size").on("input", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'fontSize', $("#text-font-size").val());
    canvas.renderAll();
  }
});

$("#text-align-left").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'textAlign', "left");
    canvas.renderAll();
  }
});

$("#text-align-right").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'textAlign', "right");
    canvas.renderAll();
  }
});

$("#text-align-center").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'textAlign', "center");
    canvas.renderAll();
  }
});

$("#text-align-justify").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
    setStyle(obj, 'textAlign', "justify");
    canvas.renderAll();
  }
});

$("#bold").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
      var isBold= getStyle(obj, "fontWeight");
      if( isBold != "bold"){
        setStyle(obj, 'fontWeight', "bold");
        canvas.renderAll();
      }else{
        setStyle(obj, 'fontWeight', "normal");
        canvas.renderAll();
      }
  }
});

$("#italic").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
      var isItalic= getStyle(obj, "fontStyle");
      if( isItalic != "italic"){
        setStyle(obj, 'fontStyle', "italic");
        canvas.renderAll();
      }else{
        setStyle(obj, 'fontStyle', "normal");
        canvas.renderAll();
      }
  }
});

$("#underline").on("click", function() {
  var obj = canvas.getActiveObject();
  if (obj) {
      var isUnderline= getStyle(obj, "underline");
      if(isUnderline != "underline"){
        setStyle(obj, 'underline', "underline");
        canvas.renderAll();
      }else{
        setStyle(obj, 'underline', "");
        canvas.renderAll();
      }
  }
});


function getStyle(object, styleName) {
  return (object.getStyleAtPosition && object.isEditing) ?
    object.getStyleAtPosition(object.selectionStart)[styleName] : object[styleName];
}


function setStyle(object, styleName, value) {
  if (object.setSelectionStyles && object.isEditing) {
    var style = {};
    style[styleName] = value;
    object.setSelectionStyles(style);
  } else {
    object[styleName] = value;
  }
}

function onSelectionChanged() {
  var obj = canvas.getActiveObject();
  if (obj.selectionStart > -1) {
    $('#fontSize').val(getStyle(obj, 'fontSize'));
  }
}


var createImage = function(src, title) {
  var img   = new Image();
  img.src   = src;
  img.alt   = title;
  img.title = title;
  return img;
};

var createOrigImage = function(x, y, src, title) {
  var img   = new Image();
  checked = false;
  img.src   = src;
  img.alt   = title;
  img.title = title;
  return [ x, y, img, checked];
};

// array of images
var images = [];
var canvas_arr = {};
var img_arr = {};
var canvases = [];
var original_arr = {};
var current = 0;
var max = 0;
var first_time = true;

function isObjectEmpty(value) {
     return (
         Object.prototype.toString.call(value) === '[object Object]' && JSON.stringify(value) === '{}'
     );
}
$('#toggle').on({
    'click': function(){
        document.body.classList.toggle("dark");}
});
$('#save').on({
    'click': function(){
        //creating an invisible element
        var element = document.createElement('a');
        element.setAttribute('href', canvas.toDataURL({
            format: 'png',
            quality: 1.0
        }));
        element.setAttribute('download', 'ready.png');
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
});
$('#save_raw').on({
    'click': function(){
        if (Object.keys(images).length > 1){
            var zip = new JSZip();
            //creating an invisible element
            for (var i in images){
                zip.file("ready" + i +".png", images[i].src.split(',')[1], {base64: true})
            }
            zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
                saveAs(blob, "ready.zip");                          // 2) trigger the download
            }, function (err) {
                jQuery("#blob").text(err);
            });
        }
    }
});


$('#save_all').on({
    'click': function(){
        if (Object.keys(canvas_arr).length > 1){
            var zip = new JSZip();
            img_arr[current] = canvas.toDataURL({
                format: 'png',
                quality: 1.0
            });
            for (var i in canvas_arr){
                zip.file("ready" + i +".png", img_arr[i].split(',')[1], {base64: true})
            }
            zip.generateAsync({type:"blob"}).then(function (blob) {
                saveAs(blob, "ready.zip");
            }, function (err) {
                jQuery("#blob").text(err);
            });
        }
    }
});
/*for the save*/
function shift(){
    if (current in original_arr){
        $("#menu").empty();
        for(var i in original_arr[current]){
            if (original_arr[current][i][3]){
                var myNewElement = $("<li><input class = \"origs\" type=\"checkbox\" id=\"" + i + "\" checked/><label for=\"" + i + "\"><img src=\"" + original_arr[current][i][2].src + "\"/></label></li>");

            }else{
                var myNewElement = $("<li><input class = \"origs\" type=\"checkbox\" id=\"" + i + "\"/><label for=\"" + i + "\"><img src=\"" + original_arr[current][i][2].src + "\"/></label></li>");
            }
            myNewElement.appendTo('#menu')
        }
    }
    if (current in canvas_arr){
        $("#counter").html((current + 1) + " / " + length);
        canvas.loadFromJSON(canvas_arr[current], canvas.renderAll.bind(canvas));
        canvas.setDimensions({width:canvas_arr[current].backgroundImage.width, height:canvas_arr[current].backgroundImage.height});
        cursor.setDimensions({width:canvas_arr[current].backgroundImage.width, height:canvas_arr[current].backgroundImage.height});
    }
    else{
        $("#counter").html((current + 1) + " / " + length);
        fabric.Image.fromURL(images[current].src, function(img) {
            canvas.setDimensions({width:img.width, height:img.height});
            cursor.setDimensions({width:img.width, height:img.height});
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
        canvas_arr[current] = canvas.toObject(['name', 'selectable', 'evented']);
        img_arr[current] = canvas.toDataURL('png');
    }
    canvas.renderAll();
}

function next(){
   if (Object.keys(images).length > 1){
        img_arr[current] = canvas.toDataURL('png');
        canvas_arr[current] = canvas.toObject(['name', 'selectable', 'evented']);
        if (current + 1 > max){
            current = 0
        }
        else{
            current = current + 1;
        }
        canvas.clear();
        shift();
    }
}
function prev(){
    if (Object.keys(images).length > 1){
        canvas_arr[current] = canvas.toObject(['name', 'selectable', 'evented']);
        img_arr[current] = canvas.toDataURL('png');
        if (current - 1 < 0){
            current = max
        } else {
            current = current - 1;}
        canvas.clear();
        shift();
    }
}

$('#next').on({
    'click': function(){
        event.preventDefault();
        next();
        $(this).attr('disabled', 'disabled');
        var disabledElem = $(this);
        setTimeout(function() {
            disabledElem.removeAttr('disabled');
        }, 500);
    }
});


$('#prev').on({
    'click': function(){
        event.preventDefault();
        prev();
        $(this).attr('disabled', 'disabled');
        var disabledElem = $(this);
        setTimeout(function() {
            disabledElem.removeAttr('disabled');
        }, 500);
    }
});

var brush = canvas.freeDrawingBrush;

var mousecursor = new fabric.Circle({
  left: 0,
  top: 0,
  radius: canvas.freeDrawingBrush.width / 2,
  fill: canvas.freeDrawingBrush.colors,
  originX: 'right',
  originY: 'bottom',
})

canvas.freeDrawingBrush.width = 10;
canvas.freeDrawingBrush.color = "black";

var cursorOpacity = .5;
//create cursor and place it off screen
var mousecursor = new fabric.Circle({
  left: -100,
  top: -100,
  radius: canvas.freeDrawingBrush.width / 2,
  fill: "rgba(255,255,255," + cursorOpacity + ")",
  stroke: "black",
        originX: 'center',
        originY: 'center'
});


canvas.on('mouse:move', function (evt) {
    if (canvas.isDrawingMode){
        var mouse = this.getPointer(evt.e);
        mousecursor.set({
          top: mouse.y,
          left: mouse.x
        }).setCoords().canvas.renderAll();
    }
});

canvas.on('mouse:out', function () {
    if (canvas.isDrawingMode){
        mousecursor
        .set({
          top: -100,
          left: -100
        })
        .setCoords().canvas.renderAll();
    }
});

$('#draw').on({
    'click': function(){
        canvas.isDrawingMode = !canvas.isDrawingMode;

        if (canvas.isDrawingMode) {
          cursor.add(mousecursor);
          isDraw = true;
          $(this).toggleClass('red');
        }
        else {
        isDraw = false;
          cursor.remove(mousecursor);
          $(this).toggleClass('red');
        }
  }
});


$('#brush-color').on({
    'change': function() {
        canvas.freeDrawingBrush.color = this.value;
        var bigint = parseInt(this.value.replace("#", ""), 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
        mousecursor.fill = "rgba(" + [r,g,b,cursorOpacity].join(",") + ")";
    }
});


$('#brush-size').on({
    'change': function() {
        brush.width = parseInt(this.value, 10) || 1;
        mousecursor
        .center()
        .set({
          radius: brush.width/2
        })
        .setCoords()
        canvas.renderAll();
        this.previousSibling.innerHTML = this.value;
    }
});


function Copy() {
	canvas.getActiveObject().clone(function(cloned) {
		_clipboard = cloned;
	});
}

function Paste() {
	// clone again, so you can do multiple copies.
	_clipboard.clone(function(clonedObj) {
		canvas.discardActiveObject();
		clonedObj.set({
		    lockScalingY: true,
            lockUniScaling: true,
			left: clonedObj.left + 10,
			top: clonedObj.top + 10,
			evented: true,
		});
		if (clonedObj.type === 'activeSelection') {
			// active selection needs a reference to the canvas.
			clonedObj.canvas = canvas;
			clonedObj.forEachObject(function(obj) {
				canvas.add(obj);
			});
			// this should solve the unselectability
			clonedObj.setCoords();
		} else {
			canvas.add(clonedObj);
		}
		_clipboard.top += 10;
		_clipboard.left += 10;
		canvas.setActiveObject(clonedObj);
		canvas.requestRenderAll();
	});
}

$(document).keydown(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
        if (e.keyCode == altKey && isDraw) canvas.isDrawingMode = false;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
        if (e.keyCode == altKey && isDraw) canvas.isDrawingMode = true;
    });


$(document).keydown(function(e) {
        obj = canvas.getActiveObject();
        if (ctrlDown && (e.keyCode == cKey)){
            //console.log(canvas.getActiveObject());
            if (obj){
                if (!obj.isEditing) {
                    Copy();
                }
            }
        };
        if (ctrlDown && (e.keyCode == vKey)){
            if (obj){
                if (!obj.isEditing) {
                    Paste();
                }
            }
        };
});


fabric.Canvas.prototype.getItemByName = function(name) {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].name && objects[i].name === name) {
      object = objects[i];
      break;
    }
  }

  return object;
};

$(document).on('change', '.origs', function(){
    let selectedid = $(this).attr('id');
    let isAChecked = $(this).prop("checked");

    original_arr[current][selectedid][3] = isAChecked;
    var x = original_arr[current][selectedid][0];
    var y = original_arr[current][selectedid][1];
    if (isAChecked){
        fabric.Image.fromURL(original_arr[current][selectedid][2].src, (image) => {
            const left = x ,
                  top = y ;
            image.set({
                name: selectedid,
                left: left,
                top: top,
                stroke: 0,
                padding: 0,
                centeredScaling: true,
                hasControls: false,
                strokeWidth: 0,
                hasBorders: 0,
                selectable: false,
                evented: false
            });
            canvas.add(image);
        });
    }else{
        original = canvas.getItemByName(selectedid);
        canvas.remove(original);
    }
});

$('#upload-file').change(function() {
    var form_data = new FormData($('#upload-file')[0]);
    document.getElementById("loader").classList.add("loader");
    $.ajax({
        type: 'POST',
        url: '/uploadajax',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data){
            document.getElementById("loader").classList.remove("loader");
            for(var k in data) {
                images.push(createImage('data:image/png;base64,' + data[k].pack.img, k));
                origs= [];
                for(var i in data[k].pack.cleaned){
                    origs.push(createOrigImage(data[k].pack.cleaned[i][0], data[k].pack.cleaned[i][1], 'data:image/png;base64,' + data[k].pack.cleaned[i][2], i))
                }
                original_arr[Object.keys(images).length - 1] = origs;
                max = Object.keys(images).length - 1;
            }
            length = Object.keys(images).length;
            $("#counter").html((current + 1) + " / " + length);
            if (first_time){
                first_time = false;
                shift();
            }
        },
    });
});
});

