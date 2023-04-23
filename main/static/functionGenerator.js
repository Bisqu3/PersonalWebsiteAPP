window.onload = function() {
 // Get the canvas element
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Set the canvas size to the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const audioCtx = new AudioContext();

// Define the function generator properties
let functions = [
  { amplitude: 0.7, frequency: 2, phase: 0, waveform: "square" },
  { amplitude: 0.3, frequency: 5, phase: 0, waveform: "sine " },
  { amplitude: 0.5, frequency: 10, phase: 0, waveform: "sine" }
];

// Define the time variable
let time = 0;

// Define the update function
function updateFunction() {
  // Update the function generator properties
  functions[0].amplitude = document.getElementById('amplitude1').value / 100;
  functions[0].frequency = document.getElementById('frequency1').value;
  functions[0].phase = (document.getElementById('phase1').value / 180) * Math.PI;
  functions[0].waveform = document.getElementById("waveform1").value;

  functions[1].amplitude = document.getElementById('amplitude2').value / 100;
  functions[1].frequency = document.getElementById('frequency2').value;
  functions[1].phase = (document.getElementById('phase2').value / 180) * Math.PI;
  functions[1].waveform = document.getElementById("waveform2").value;

  functions[2].amplitude = document.getElementById('amplitude3').value / 100;
  functions[2].frequency = document.getElementById('frequency3').value;
  functions[2].phase = (document.getElementById('phase3').value / 180) * Math.PI;
  functions[2].waveform = document.getElementById("waveform3").value;
}

// Add event listeners to the sliders to update the function generator properties
document.getElementById('amplitude1').addEventListener('input', updateFunction);
document.getElementById('frequency1').addEventListener('input', updateFunction);
document.getElementById('phase1').addEventListener('input', updateFunction);
document.getElementById('waveform1').addEventListener('input', updateFunction);

document.getElementById('amplitude2').addEventListener('input', updateFunction);
document.getElementById('frequency2').addEventListener('input', updateFunction);
document.getElementById('phase2').addEventListener('input', updateFunction);
document.getElementById('waveform2').addEventListener('input', updateFunction);

document.getElementById('amplitude3').addEventListener('input', updateFunction);
document.getElementById('frequency3').addEventListener('input', updateFunction);
document.getElementById('phase3').addEventListener('input', updateFunction);
document.getElementById('waveform3').addEventListener('input', updateFunction);

// Define the draw function
function drawFunction() {
  // Clear the canvas
  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the waveform
  context.beginPath();
  context.strokeStyle = '#ffffff';
  context.lineWidth = 2;

  for (let x = 0; x < canvas.width; x++) {
    let y = 0;
    for (let i = 0; i < functions.length; i++) {
      let fn = functions[i];
      let value = 0;
      if (fn.waveform === 'sine') {
        value = fn.amplitude * Math.sin((2 * Math.PI * fn.frequency * x) / canvas.width + fn.phase + time);
      } else if (fn.waveform === 'square') {
        value = fn.amplitude * Math.sign(Math.sin((2 * Math.PI * fn.frequency * x) / canvas.width + fn.phase + time));
      } else if (fn.waveform === 'saw') {
        let period = canvas.width / fn.frequency;
        let posInPeriod = ((x + fn.phase * period / (2 * Math.PI)) % period);
        value = fn.amplitude * ((2 * posInPeriod / period) - 1);
      }
      y += value;
    }
    y /= functions.length;
    let xPos = x;
    let yPos = (canvas.height / 2) + (y * (canvas.height / 2));
    if (x == 0) {
      context.moveTo(xPos, yPos);
    } else {
      context.lineTo(xPos, yPos);
    }
  }

  context.stroke();
  const bufferLength = 4096;
const sampleRate = audioCtx.sampleRate;

// Create an audio buffer to store the waveform
const audioBuffer = audioCtx.createBuffer(1, bufferLength, sampleRate);

// Fill the audio buffer with the waveform
const channelData = audioBuffer.getChannelData(0);
  for (let i = 0; i < bufferLength; i++) {
    let value = 0;
    for (let j = 0; j < functions.length; j++) {
      let fn = functions[j];
      if (fn.waveform === 'sine') {
        value += fn.amplitude * Math.sin((2 * Math.PI * fn.frequency * i) / sampleRate + fn.phase + time);
      } else if (fn.waveform === 'square') {
        value += fn.amplitude * Math.sign(Math.sin((2 * Math.PI * fn.frequency * i) / sampleRate + fn.phase + time));
      } else if (fn.waveform === 'saw') {
        let period = sampleRate / fn.frequency;
        let posInPeriod = ((i + fn.phase * period / (2 * Math.PI)) % period);
        value += fn.amplitude * ((2 * posInPeriod / period) - 1);
      }
    }
    value /= functions.length;
    channelData[i] = value;
  }
  
  // Create a source node from the audio buffer
  const sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = audioBuffer;
  
  // Connect the source node to the audio context output
  sourceNode.connect(audioCtx.destination);
  
  // Start the audio playback
  
  sourceNode.start();

  // Increment the time variable
  time += bufferLength / sampleRate;
  
  // Start the animation
  requestAnimationFrame(drawFunction);
}

// Start the animation
requestAnimationFrame(drawFunction);

};


