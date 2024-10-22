function gebi(s) { return document.getElementById(s); }
document.addEventListener('DOMContentLoaded', function () {
    var type = 2; //alternate between type 1 or type 2
    var logo = gebi('logo');
    var video = gebi('video');
    var canvas = gebi('canvas');
    var ctx = canvas.getContext('2d');
    var sampleSize = 50;
    var threshold = 50;
    var previousFrame = null;
    var activeThreshold = 0.5; //put higher for higher ratio
    var activeThresholdExceeded = false;
    var logodisplay = false;

    if((!logodisplay) && (type==2)){
        logo.style.display = 'block';
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            video.addEventListener('play', function () {
                var drawFrame = function () {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    motionDetection();
                    requestAnimationFrame(drawFrame);
                };
                drawFrame();
            });
        })
        .catch(function (error) {
            console.error('Error accessing webcam:', error);
        });

    function motionDetection() {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        if (previousFrame) {
            var blackPixelsCount = 0;
            for (var y = 0; y < canvas.height; y += sampleSize) {
                for (var x = 0; x < canvas.width; x += sampleSize) {
                    var pos = (x + y * canvas.width) * 4;
                    var r = imageData[pos];
                    var g = imageData[pos + 1];
                    var b = imageData[pos + 2];
                    var isBlack = r < threshold && g < threshold && b < threshold;
                    if (isBlack) {
                        blackPixelsCount++;
                    }
                    var colorDifference = Math.abs(previousFrame[pos] - r) + Math.abs(previousFrame[pos + 1] - g) + Math.abs(previousFrame[pos + 2] - b);
                    if (isBlack && colorDifference > threshold) {
                        ctx.fillStyle = rgb(r, g, b);
                        ctx.fillRect(x, y, sampleSize, sampleSize);
                    }
                }
            }
            var totalPixels = (canvas.width / sampleSize) * (canvas.height / sampleSize);
            var blackRatio = blackPixelsCount / totalPixels;

            if (!activeThresholdExceeded && blackRatio < activeThreshold) {
                activeThresholdExceeded = true;

                if (type == 2) {
                    logo.style.display = 'none';
                    videoPlayer.style.display = 'block';
                    logodisplay = true;
                }

                videoPlayer.currentTime = 0;
                videoPlayer.play();

            } else if (activeThresholdExceeded && blackRatio >= activeThreshold) {
                activeThresholdExceeded = false;
                if (type == 2) {
                    logo.style.display = 'block';
                    videoPlayer.style.display = 'none';
                    videoPlayer.pause();
                }

            }
        }
        previousFrame = new Uint8Array(imageData);
    }

    function rgb(r, g, b) {
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    function refreshPage() {
        location.reload();
    }
    setTimeout(refreshPage, 3600000);
});