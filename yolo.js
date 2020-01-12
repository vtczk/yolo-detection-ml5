let yoloModel;
let width = 480;
let height = 360;
let context;
let camera;
let canvas;
let colors = ["red","blue","green","yellow","orange","black","magenta"];

async function startApplication() {

    camera = await
    getCameraFeed();
    yoloModel = await
    ml5.YOLO(camera, onModelStart);
    canvas = getCanvas();
    context = canvas.getContext("2d");

}

function onModelStart() {
    console.log("Model is ready to serve traffic");
    console.log(yoloModel);
    detectionCallback(camera)
}

function getCanvas() {

    var canvasElement = document.createElement("canvas");
    canvasElement.width = width;
    canvasElement.height = height;


    document.body.appendChild(canvasElement);

    return canvasElement
}

async function getCameraFeed() {
    var camera = document.createElement("video");
    camera.setAttribute("style", "display: none;");
    camera.width = width;
    camera.height = height;
    document.body.appendChild(camera);

    var mediaDevice = await
    navigator.mediaDevices.getUserMedia({video: true});
    camera.srcObject = mediaDevice;
    camera.play();

    return camera;
}

function detectionCallback() {
    yoloModel.detect(function (err, results) {
        if (err) {
            console.log(err);
            return
        }
        objects = results;

        if (objects) {
            showResults(objects, camera);
        }

        detectionCallback();
    });
}


function showResults(objects) {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);

    context.drawImage(camera, 0, 0);
    for (var i = 0; i < objects.length; i++) {

        context.font = "14px Comic Sans MS";
        context.fillStyle = colors[i];
        context.fillText(objects[i].label, objects[i].x * width + 4, objects[i].y * height + 14);

        context.beginPath();
        context.rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
        context.strokeStyle = colors[i];
        context.stroke();
        context.closePath();

    }
}

document.addEventListener('DOMContentLoaded', startApplication);
