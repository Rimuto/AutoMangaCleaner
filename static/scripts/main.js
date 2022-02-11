var id = 0;
var selected_div;

$( document ).ready(function() {
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




// Image factory
var createImage = function(src, title) {
  var img   = new Image();
  img.src   = src;
  img.alt   = title;
  img.title = title;
  return img;
};

// array of images
var images = [];
var current = 0;
var max = 0;

$(function(){
$('#next').on({
    'click': function(){
        if (current + 1 > max){
            current = 0
        }
        else{
            current = current + 1;}
        $('#myimage').attr('src', images[current].src);
    }
});
});


$(function(){
$('#prev').on({
    'click': function(){
        if (current - 1 < 0){
            current = max
        } else {
            current = current - 1;}
        $('#myimage').attr('src', images[current].src);
    }
});
});


$(function(){
$('#upload-file-btn').click(function() {
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
                console.log(k, data[k]);
                images.push(createImage('data:image/png;base64,' + data[k].img, k));
                max = k;
                //var img = $('<img id="image_id">');
                //img.attr('src', 'data:image/png;base64,' + data[k].img);
                //img.appendTo('#imgContainer');
            }
            var img = $('<img id="image_id">');
            img.attr('src', images[0].src);
            img.appendTo('#imgContainer');
            //console.log(data);
        },
    });
});
});