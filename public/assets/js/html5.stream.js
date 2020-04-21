const [w,h, fp, ch] = [480, 320, 24, 1];

var start = () => navigator.mediaDevices.getUserMedia(
    { 
        video: {width:w, height: h, frameRate: fp,  }, 
        audio: {
            channelCount: ch, 
            echoCancellation: true, 
            noiseSuppression: true, 
            autoGainControl: false,
        } 
    })
  .then(handleStreams)
  .catch((e) => {console.log(e)});
  
var canvas = document.createElement("canvas.myStream");
canvas.width = w;
canvas.height = h;

var initData;
var interval;

function processVideoStream(video)
{
    preview.getContext('2d').drawImage(video, 0, 0, 640, 480);
    let data = preview.toDataURL("image/jpeg");   
    
    if(initData !== data)
    {
        initData = data;
        socket.emit('inputstream-video', data);
    }
}

const handleVideo = (stream) => {
    video.srcObject = stream;
    video.play();
    if(interval)
    clearInterval(interval);
    interval = setInterval(() => {processVideoStream(video)}, 160);    
}


const handleAudio = function(stream) {
    
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const source = audioContext.createMediaStreamSource(stream);
    const anl = audioContext.createAnalyser();
    anl.fftSize = 8192;
    source.connect(anl);
    //anl.connect(audioContext.destination);

    setInterval(function () {
        var array = new Uint8Array(anl.frequencyBinCount);
        anl.getByteTimeDomainData(array);
        socket.emit('inputstream-audio', array);
        
    }, 50);
    // const processor = audioContext.createScriptProcessor(8192, 1, 1);

    // source.connect(processor);
    // processor.connect(audioContext.destination);
    
    // processor.onaudioprocess = function(e) {
    //     socket.emit('inputstream-audio', e.inputBuffer.getChannelData(0));
    // };
};

const handleStreams = (stream) =>
{
    if(stream instanceof MediaStream)
    {
        handleVideo(stream);
    }
    handleAudio(stream)
}
