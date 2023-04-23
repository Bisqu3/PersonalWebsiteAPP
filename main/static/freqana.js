const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');
const reactivitySlider = document.getElementById('reactivity-slider');

canvas.width = window.innerWidth + 5;
canvas.height = window.innerHeight + 5;

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const prevDataArray = new Uint8Array(bufferLength);

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);

        // Create the equalizer filters
        const equalizerFrequencies = [60, 170, 350, 1000, 2000, 4000, 8000, 16000];
        const filters = equalizerFrequencies.map(createFilter);

        function createFilter(frequency) {
            const filter = audioContext.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = frequency;
            filter.Q.value = 1;
            filter.gain.value = 0;
            return filter;
        }

        // Connect the filters in series
        filters.reduce((prev, curr) => {
            prev.connect(curr);
            return curr;
        }, source).connect(analyser);

        drawVerticalOscilloscope();
    })
    .catch(err => console.error('Error:', err));

let yOffset = -500;
const yOffsetStep = 0.01;
const xOffsetStep = canvas.width / (canvas.height / yOffsetStep);

let verticalCycles = 0;

let lineWidth = 1;
let prevFrequencyValue = 0;
let currentColor = 'black';

function drawVerticalOscilloscope() {
    requestAnimationFrame(drawVerticalOscilloscope);
    analyser.getByteFrequencyData(dataArray);

    ctx.lineWidth = lineWidth;

    const sliceWidth = canvas.width / bufferLength;

    let loudestIndex = 0;
    let loudestValue = -Infinity;

    // Calculate the loudest frequency in the buffer
    for (let i = 0; i < bufferLength; i++) {
        const frequencyValue = dataArray[i];
        if (frequencyValue > loudestValue) {
            loudestIndex = i;
            loudestValue = frequencyValue;
        }
    }

    if (loudestValue > prevFrequencyValue) {
        if (loudestValue < 200) {
            lineWidth = 1;
        } else if (loudestValue < 230) {
            lineWidth = 2;
        } else if (loudestValue < 240) {
            lineWidth = 4;
        } else if (loudestValue < 245) {
            lineWidth = 8;
        } else if (loudestValue < 250) {
            lineWidth = 16;
        } else if (loudestValue < 252) {
            lineWidth = 32;
        } else {
            lineWidth = 64;
        }
    }

    prevFrequencyValue = loudestValue;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height / 2)     + yOffset;

        const prevV = prevDataArray[i] / 128.0;
        const prevY = (prevV * canvas.height / 2) + yOffset;
    
        const collision = Math.abs(prevY - y) < ctx.lineWidth;
    
        if (dataArray[i] === 0) {
            // Set the color to black for frequencies with no sound
            ctx.strokeStyle = 'black';
            ctx.shadowBlur = 0;
            ctx.lineWidth = 1;
        } else if (i === loudestIndex) {
            // Set the stroke color based on the calculated hue and lightness, and collision detection
            const hue = Math.floor((loudestIndex / bufferLength) * 360);
            const lightness = Math.min(90, 30 + (loudestValue / 255) * 70);
    
            // Determine whether to fade to black or to white
            if (currentColor === 'black') {
                if (lineWidth > 16) {
                    ctx.strokeStyle = collision ? 'white' : 'black';
                } else {
                    ctx.strokeStyle = collision ? 'black' : 'white';
                }
            } else {
                if (lineWidth > 16) {
                    ctx.strokeStyle = collision ? 'black' : 'white';
                } else {
                    ctx.strokeStyle = collision ? 'white' : 'black';
                }
            }
    
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'white';
            currentColor = ctx.strokeStyle;
        } else {
            // Set the color based on the collision detection and the current line color
            if (currentColor === 'black') {
                ctx.strokeStyle = collision ? 'black' : 'white';
            } else {
                ctx.strokeStyle = collision ? 'white' : 'black';
            }
            ctx.shadowBlur = 0;
        }
    
        ctx.beginPath();
        ctx.moveTo(sliceWidth * i, yOffset);
        ctx.lineTo(sliceWidth * i, y);
    
        ctx.stroke();
    }
    
    // Store the current data as the previous data for the next frame
    prevDataArray.set(dataArray);
    
    yOffset += yOffsetStep * parseFloat(reactivitySlider.value);
    
    if (yOffset >= canvas.height) {
        yOffset = 0;
        verticalCycles++;
    }
    
    if (verticalCycles * xOffsetStep >= canvas.width) {
        verticalCycles = 0;
    }
}    
