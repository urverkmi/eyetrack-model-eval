// ------------------------------
// Calibration Module
// ------------------------------

let calibrationIndex = 0;
let calibrationPoints = [];
let onCalibrationComplete = null;

// 9-point grid positions (0–1 normalized)
const CALIB_POINTS = [
    [0.1, 0.1], [0.5, 0.1], [0.9, 0.1],
    [0.1, 0.5], [0.5, 0.5], [0.9, 0.5],
    [0.1, 0.9], [0.5, 0.9], [0.9, 0.9]
];

function startCalibration(callback) {
    onCalibrationComplete = callback;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "calibration-overlay";

    overlay.innerHTML = `
        <div id="calibration-instructions">
            Look at each dot and click it when ready
        </div>
        <div id="calibration-grid"></div>
    `;

    document.body.appendChild(overlay);

    const grid = document.getElementById("calibration-grid");

    // Add dots
    CALIB_POINTS.forEach(([px, py], index) => {
        const dot = document.createElement("div");
        dot.className = "calib-point";
        dot.style.left = `${px * 100}%`;
        dot.style.top = `${py * 100}%`;
        dot.dataset.index = index;

        dot.addEventListener("click", () => handleCalibrationClick(index, dot));

        grid.appendChild(dot);
        calibrationPoints.push(dot);
    });
}

async function handleCalibrationClick(index, dot) {
    dot.style.opacity = "0.2";

    // Collect gaze samples for ~1 sec
    const samples = [];
    const sampleTimer = setInterval(() => {
        const pred = webgazer.getCurrentPrediction();
        if (pred) samples.push([pred.x, pred.y]);
    }, 50);

    await new Promise(res => setTimeout(res, 3000));
    clearInterval(sampleTimer);

    if (samples.length > 0) {
        const screenX = window.innerWidth  * CALIB_POINTS[index][0];
        const screenY = window.innerHeight * CALIB_POINTS[index][1];

        // Simulate a click to train WebGazer
        // const evt = new MouseEvent("click", {
        //     clientX: screenX,
        //     clientY: screenY,
        //     bubbles: true,
        //     cancelable: true
        // });
        // document.dispatchEvent(evt);

        for (let i = 0; i < samples.length; i++) {
            webgazer.recordScreenPosition(screenX, screenY, "calibration");
        }
    }

    calibrationIndex++;

    if (calibrationIndex >= CALIB_POINTS.length) {
        finishCalibration();
    }
}

function finishCalibration() {
    const overlay = document.getElementById("calibration-overlay");
    if (overlay) overlay.remove();

    if (onCalibrationComplete) onCalibrationComplete();
}
