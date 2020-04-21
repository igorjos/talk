var host = window.location.host;

var socket = io(`https://${host}`);
var other = document.querySelector("canvas.otherStream");
var audio = document.querySelector('audio');
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = audioCtx.createBuffer(1, 8192, 44100);

socket.on('connect', function(){});
socket.on('welcome', function(data){
    socket.emit('incoming', 'Yo');
});

socket.on('outputstream-video', (data) => {
    blob2canvas(other, data);
})

socket.on('outputstream-audio', (data) => {
    bufferAudio(data);
})

socket.on('disconnect', function(){});

function bufferAudio(audioFloat32)
{
    
    //audioFloat32 = Float32Array.from(Object.values(audioFloat32))
    audioFloat32 = I8AtoF32A(Object.values(audioFloat32))
    audioBuffer.copyToChannel(audioFloat32, 0);
    
    let source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
}

function blob2canvas(canvas, blob){
    var img = new Image;
    var ctx = canvas.getContext('2d');
    img.onload = function () {
        ctx.drawImage(img,0,0);
    }
    img.src = blob;
}

const I8AtoF32A = (incomingData) => { 
    var i, l = incomingData.length;
    var outputData = new Float32Array(incomingData.length * 2);
    for (i = 0; i < l; i++) {
        outputData[i] = (incomingData[i] - 128) / 128.0;
    }
    return outputData;
}