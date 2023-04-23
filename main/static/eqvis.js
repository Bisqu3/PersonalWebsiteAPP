const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');
const reactivitySlider = document.getElementById('reactivity-slider');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const peakThreshold = 175;
const markerFadeRate = 0.01;
const minGroupSize = 3;

const markerPositions = [];
const markerOpacities = [];

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);

        const eqFrequencies = [60, 170, 350, 1000, 2000, 4000, 8000, 16000];
        const filters = eqFrequencies.map(createFilter);

        function createFilter(frequency) {
            const filter = audioContext.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = frequency;
            filter.Q.value = 1;
            filter.gain.value = 0;
            return filter;
        }

        filters.reduce((prev, curr) => {
            prev.connect(curr);
            return curr;
        }, source).connect(analyser);

        const eqSliders = document.querySelectorAll('.eq-slider');
        eqSliders.forEach((slider, index) => {
            slider.addEventListener('input', () => {
                filters[index].gain.value = parseFloat(slider.value);
            });
        });

        drawEqualizerOutput();
    })
    .catch(err => console.error('Error:', err));

function detectGroupCenter(startIndex) {
    let endIndex = startIndex;
    while (endIndex < bufferLength && dataArray[endIndex] >= peakThreshold) {
        endIndex++;
    }
    const centerIndex = Math.floor((startIndex + endIndex) / 2);
    return (centerIndex - 1) * (canvas.width / bufferLength) * 2.5 + (canvas.width / bufferLength) * 1.25;
}

function drawEqualizerOutput() {
    requestAnimationFrame(drawEqualizerOutput);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    let groupStartIndex = -1;
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        if (barHeight >= peakThreshold) {
            if (groupStartIndex === -1) {
                groupStartIndex = i;
            }
        } else {
            if (groupStartIndex !== -1 && i - groupStartIndex >= minGroupSize) {
                const groupCenterX = detectGroupCenter(groupStartIndex);
                const markerIndex = markerPositions.findIndex(pos => Math.abs(pos - groupCenterX) < barWidth);
                if (markerIndex === -1) {
                    markerPositions.push(groupCenterX);
                    markerOpacities.push(1);
                } else {
                    markerPositions[markerIndex] = groupCenterX;
                    markerOpacities[markerIndex] = 1;
                }
            }
            groupStartIndex = -1;
        }

        x += barWidth + 1;
    }

    for (let i = 0; i < markerPositions.length; i++) {
        if (markerOpacities[i] > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${markerOpacities[i]})`;
            ctx.font = '20px Arial';
            ctx.fillText('A', markerPositions[i], canvas.height / 2);
            markerOpacities[i] -= markerFadeRate;
        } else {
            markerPositions.splice(i, 1);
            markerOpacities.splice(i, 1);
            i--;
        }
    }
}

