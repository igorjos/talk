var host = window.location.host;

var socket = io(`http://${host}`);
var other = document.querySelector("canvas.otherStream");
var audio = document.querySelector('audio');
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

socket.on('connect', function(){});
socket.on('welcome', function(data){
    socket.emit('incoming', 'Yo');
});

socket.on('outputstream', (data) => {
    
    blob2canvas(other, data.video);
    bufferAudio(data.audio);
    document.querySelector('div.log').innerHTML = new Date().getTime();
})
socket.on('disconnect', function(){});

function bufferAudio(audioFloat32)
{
    let audioBuffer = audioCtx.createBuffer(1, 2048, 44100);
    audioFloat32 = Float32Array.from(Object.values(audioFloat32))
    
    audioBuffer.copyToChannel(audioFloat32, 0);
    
    let source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = audioBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);
    // start the source playing
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