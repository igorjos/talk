var start = () => navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  
  .then(handleSuccess)
  .catch((e) => {console.log(e)});

var canvas = document.createElement("canvas.myStream");
var initData;
var interval;

canvas.width = 640;
canvas.height = 480;

function startStream({audio})
{
    preview.getContext('2d').drawImage(video, 0, 0, 640, 480);
    let data = preview.toDataURL("image/jpeg");   
    
    if(initData !== data)
    {
        initData = data;
        socket.emit('inputstream', {audio: audio, video: data});
    }
}

const handleSuccess = function(stream) {
    
    if(stream instanceof MediaStream)
    {
        video.srcObject = stream;
    }

    const context = new (window.AudioContext || window.webkitAudioContext)();
    context.createDelay(140);

    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(2048, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
        
        startStream({audio: e.inputBuffer.getChannelData(0) })
    };
  };