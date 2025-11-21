
let images = [];

fetch("images/images.json")
  .then(response => response.json())
  .then(data => {
      images = data.files.map(f => "images/" + f);
      console.log("Loaded images:", images);
  });

let gazeLog = [];
let trialIndex = 0;
let currentImage = null;

// Start gaze listener
function startWebgazerListener() {
    const SMOOTHING = 0.2;
    let lastX = null, lastY = null;
    webgazer.setGazeListener((data, ts) => {
        if (!data) return;
        if (lastX === null) {
            lastX = data.x;
            lastY = data.y;
        }

        const smoothX = lastX + SMOOTHING * (data.x - lastX);
        const smoothY = lastY + SMOOTHING * (data.y - lastY);

        lastX = smoothX;
        lastY = smoothY;
        
        gazeLog.push({
            t: ts,
            x: data.x,
            y: data.y,
            trial: trialIndex,
            img: currentImage
        });
    });
}

// Show images one by one
function showNextImage() {
    if (trialIndex >= images.length) {
        alert("Experiment finished!");
        return;
    }
    currentImage = images[trialIndex];
    document.getElementById("stimulus").src = currentImage;

    trialIndex++;
    setTimeout(showNextImage, 3000);
}

// Download data
document.getElementById("download").onclick = () => {
    let blob = new Blob([JSON.stringify(gazeLog)], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "gaze_data.json";
    a.click();
};

// On page load — start calibration first
window.onload = async () => {
    await webgazer.setRegression('ridge')
        .setTracker('clmtrackr')
        .begin();

    webgazer.showVideoPreview(true)
            .showPredictionPoints(true)
            .showVideo(true);

    // Stop default click-based training
    webgazer.params.storingPoints = false;

    startCalibration(() => {
        console.log("Calibration complete.");
        startWebgazerListener();
        showNextImage();
    });
};
