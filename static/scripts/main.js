$(function() {
$(document).ready(function() {
    const element = document.getElementById('panzoom')
    panzoom(element, {
        maxZoom: 10,
        minZoom: 0.5,
        zoomDoubleClickSpeed: 1,
        onDoubleClick: function(e) {
            return false;
         },
        beforeMouseDown: function(e) {
            var shouldIgnore = !e.altKey;
            return shouldIgnore;
        }
    });
});



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
    cKey = 67;

var id = 0;
var selected_div;

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

var canvas = new fabric.Canvas("canvas");
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

$( "#add" ).click(function() {
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

$("#font-family").on("input", function() {
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
var original_arr = {};
var current = 0;
var max = 0;

function isObjectEmpty(value) {
     return (
         Object.prototype.toString.call(value) === '[object Object]' && JSON.stringify(value) === '{}'
     );
}

$('#save').on({
    'click': function(){
        this.href = canvas.toDataURL({
            format: 'png',
            quality: 0.8
        });
        this.download = 'custom.png';
    }
});

/*for the save*/

$('#next').on({
    'click': function(){
        event.preventDefault();
        canvas_arr[current] = canvas.toObject();

        if (current + 1 > max){
            current = 0
        }
        else{
            current = current + 1;}
        canvas.clear();

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
            canvas.loadFromJSON(canvas_arr[current], canvas.renderAll.bind(canvas));
            canvas.setDimensions({width:canvas_arr[current].backgroundImage.width, height:canvas_arr[current].backgroundImage.height});
        }
        else{
            fabric.Image.fromURL(images[current].src, function(img) {
                canvas.setDimensions({width:img.width, height:img.height});
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        }
        //canvas.loadFromJSON(canvas_arr[current], canvas.renderAll.bind(canvas));
        //$('#myimage').attr('src', images[current].src);
    }
});

$('#prev').on({
    'click': function(){
        event.preventDefault();
        canvas_arr[current] = canvas.toObject();
        if (current - 1 < 0){
            current = max
        } else {
            current = current - 1;}
        canvas.clear();

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
            canvas.loadFromJSON(canvas_arr[current], canvas.renderAll.bind(canvas));
            canvas.setDimensions({width:canvas_arr[current].backgroundImage.width, height:canvas_arr[current].backgroundImage.height});
        }
        else{
            fabric.Image.fromURL(images[current].src, function(img) {
                canvas.setDimensions({width:img.width, height:img.height});
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        }
    }
});

var brush = canvas.freeDrawingBrush;

$('#draw').on({
    'click': function(){
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
          $(this).toggleClass('red');
        }
        else {
          $(this).toggleClass('red');
        }
  }
});

$('#brush-color').on({
    'change': function() {
        brush.color = this.value;
    }
});


$('#brush-size').on({
    'change': function() {
        brush.width = parseInt(this.value, 10) || 1;
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
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
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
    $.ajax({
        type: 'POST',
        url: '/uploadajax',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            images = [];
            for(var k in data) {
                images.push(createImage('data:image/png;base64,' + data[k].pack.img, k));
                max = k;
                origs= [];
                for(var i in data[k].pack.cleaned){
                    origs.push(createOrigImage(data[k].pack.cleaned[i][0], data[k].pack.cleaned[i][1], 'data:image/png;base64,' + data[k].pack.cleaned[i][2], i))
                }
                original_arr[k] = origs;
            }

            var src = document.getElementById("menu");
            for(var i in original_arr[0]){
                var myNewElement = $("<li><input class = \"origs\" type=\"checkbox\" id=\"" + i + "\"/><label for=\"" + i + "\"><img src=\"" + original_arr[0][i][2].src + "\"/></label></li>");
                myNewElement.appendTo('#menu')
            }
            console.log($("input[class='origs']").length)
            fabric.Image.fromURL(images[0].src, function(img) {
                 canvas.setDimensions({width:img.width, height:img.height});
                 canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        },
    });
});















});





/*$( document ).ready(function() {
    const element = document.getElementById('mainContainer')
    const panzoom = Panzoom(element, {
        bound:'outer',
        excludeClass: 'textblck'
    });
    element.addEventListener('wheel', panzoom.zoomWithWheel, { passive: false });
});


$(function(){
		$('#addt').on({
		'click': function(){
			var txt = $("<div id = \"txt" + id +"\" class = \"textblck\" onmousedown=\"this.style.border = \"dashed 2px #FF7F27\";\"><div><span >sample text</span></div></div>");
			txt.draggable({
                containment: '#myWindow',
				start: function (event, ui) {
					var left = parseInt($(this).css('left'),10);
					left = isNaN(left) ? 0 : left;
					var top = parseInt($(this).css('top'),10);
					top = isNaN(top) ? 0 : top;
					recoupLeft = left - ui.position.left;
					recoupTop = top - ui.position.top;
				},
				drag: function (event, ui) {
					ui.position.left += recoupLeft;
					ui.position.top += recoupTop;
				}
            });
			id = id + 1;
			var textstyle = 'textstyle';
			txt.removeAttr("style");
			txt.addClass(textstyle);
			txt.rotatable({rotationCenterOffset: {
					top: 0,
					left: 0
				  },
				   wheelRotate: false
				});
			txt.appendTo('#mainContainer');
		}
	});
	});

$(function(){
    $('#del').on({
    'click': function(){
    if (jQuery.isEmptyObject(selected_div)){
        console.log("empty!");
    }else{
        $("#" + selected_div[0].id).remove();
    }
    }
});
});



$(document).ready(function () {
$('body').on('click', '#mainContainer > div', function() {
    //console.log($cur)
    selected_div = $(this);
    var highlight = 'highlight';
    $('#mainContainer > div').removeClass(highlight);
    $(this).addClass(highlight);

    let editor = tinymce.get('textArea');
    editor.setContent(selected_div[0].children[0].innerHTML)

    //document.getElementById('textArea').value = selected_div[0].innerText;
    console.log(selected_div[0].children[0].innerHTML)
});
});



// Select image and show it.
let chooseImage = () => {
    document.getElementById('file').click();
};


let textContainer;
let t = 'sample text';

// Get the values that you have entered in the textarea and
// write it in the DIV over the image.

let writeText = (ele) => {
    t = ele.value;
    selected_div[0].children[0].innerText = t.replace(/\n\r?/g, '<br />');
}
function GetScreenCordinates(obj) {
    var p = {};
    p.x = obj.offsetLeft;
    p.y = obj.offsetTop;
    while (obj.offsetParent) {
        p.x = p.x + obj.offsetParent.offsetLeft;
        p.y = p.y + obj.offsetParent.offsetTop;
        if (obj == document.getElementsByTagName("body")[0]) {
            break;
        }
        else {
            obj = obj.offsetParent;
        }
    }
    return p;
}
// Finally, save the image with text over it.
let saveImageWithText = () => {

    let textContainer = document.getElementById('txt0');     // The element with the text.
    let span = document.getElementById('txt0').children[0].children[0];
    let t = textContainer.innerText;
    // Create an image object.
    let img = new Image();
    img.src = document.getElementById('myimage').src;

    // Create a canvas object.
    let canvas = document.createElement("canvas");

    // Wait till the image is loaded.
    img.onload = function(){
        drawImage();
        downloadImage(img.src.replace(/^.*[\\\/]/, ''));    // Download the processed image.
    }

    // Draw the image on the canvas.
    let drawImage = () => {
        let ctx = canvas.getContext("2d");	// Create canvas context.

        // Assign width and height.
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image.
        ctx.drawImage(img, 0, 0);

        textContainer.style.border = 0;

        // Get the padding etc.
        let left = parseInt(window.getComputedStyle(textContainer).left);
        let right = textContainer.getBoundingClientRect().right;
        let top = parseInt(window.getComputedStyle(textContainer).top, 0);
        let center = textContainer.getBoundingClientRect().width / 2;

        let paddingTop = window.getComputedStyle(span).paddingTop.replace('px', '');
        let paddingLeft = window.getComputedStyle(span).paddingLeft.replace('px', '');
        let paddingRight = window.getComputedStyle(span).paddingRight.replace('px', '');

        // Get text alignement, colour and font of the text.
        let txtAlign = window.getComputedStyle(span).textAlign;
        let color = window.getComputedStyle(span).color;
        let fnt = window.getComputedStyle(span).font;
        let angle = parseFloat(/[-0-9/.]+/.exec(textContainer.style.transform)[0]);

        // Assign text properties to the context.
        ctx.font = fnt;
        ctx.fillStyle = color;
        ctx.textAlign = txtAlign;

        // Now, we need the coordinates of the text.
        let x; 		// coordinate.
        if (txtAlign === 'right') {
            x = right + parseInt(paddingRight) - 11;
        }
        if (txtAlign === 'left') {
            x = left + parseInt(paddingLeft);
        }
        if (txtAlign === 'center') {
            x = center + left;
        }
        x += 5;
        // Get the text (it can a word or a sentence) to write over the image.
        let str = t.replace(/\n\r?/g, '<br />').split('<br />');
        var p = GetScreenCordinates(span);
        console.log(p.x, images[current].height - p.y);
        // finally, draw the text using Canvas fillText() method.
        for (let i = 0; i <= str.length - 1; i++) {
            let y = parseInt(paddingTop, 10) + parseInt(top, 10) + 20 + (i * 20);
            //ctx.save();
            console.log(x, y)
            //ctx.translate(x, y);

            //ПРОВЕРИТЬ ДОБАВЛЕНИЕ АБЗАЦОВ и ПОВОРОТЫ



            //ctx.rotate( Math.PI / 2 );
            ctx.fillText(
                str[i]
                    .replace('</div>','')
                    .replace('<br>', '')
                    .replace(';',''),
                //0, 0
                x, y
                //parseInt(paddingTop, 10) + parseInt(top, 10) + 25 + (i * 15)
                );
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            //ctx.restore();
        }

        // document.body.append(canvas);  // Show the image with the text on the Canvas.
    }

    // Download the processed image.
    let downloadImage = (img_name) => {
        let a = document.createElement('a');
        a.href = canvas.toDataURL("image/png");
        a.download = img_name;
        document.body.appendChild(a);
        a.click();
    }
}
*/



// Image factory


