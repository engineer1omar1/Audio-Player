// Data Tracks
const tracks = [
  {title: "The Time", description: "Best Universe Secrets", sourse: "audio/01_Best_Universe_Secrets.mp3"},
  {title: "The Brain", description: "How The Brain Evolved", sourse: "audio/02_How_The_Brain_Evolved.mp3"},
  {title: "The Dragon", description: "The Legend Of Dragon", sourse: "audio/03_The_Legend_of_Dragon.mp3"},
];

// Select HTML Elements
const audio = document.getElementById("audio");
const trackTitle = document.getElementById("track-title");
const trackDescription = document.getElementById("track-description");
const trackNumber = document.getElementById("track-number");
const playButton = document.getElementById("play");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volume-value");
const statusMessage = document.getElementById("status");

// Play Track
let trackIndex = 0;

// Load The Current Track and Reset Time
function loadTrack() {

  audio.pause();
  const track = tracks[trackIndex];
  audio.src = track.sourse;
  trackNumber.textContent = `Audio 0${trackIndex + 1} / 0${tracks.length}`
  trackTitle.textContent = track.title;
  trackDescription.textContent = track.description;
  progress.disabled = true;
  progress.value = 0;
  currentTime.textContent = "0:00"
  duration.textContent = "0:00"
  statusMessage.textContent = "You Are Ready";

  updateTrack();
}

function playTrack() {
    audio.play().catch((error) => {
        if (error.name !== "AbortError") {
            showError();
        }
    });
}

function togglePlay() {
    if (audio.paused) {
        playTrack();
    } else {
        audio.pause();
    }
}

function formatTime(second) {
    if (!Number.isFinite(second)) return "0:00";
    const minutes = Math.floor(second / 60);
    const remaingingSecond = Math.floor(second % 60);
    return `${minutes}:${String(remaingingSecond).padStart(2, "0")}`
}

// Show The Track Duration Once The Browser Has Loaded Its Meta Data 
function updateDuration() {
	duration.textContent = formatTime(audio.duration);
	progress.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
}

// Update The Time And Slider Progress During Playback
function updateProgress() {
	currentTime.textContent = formatTime(audio.currentTime);
	if (Number.isFinite(audio.duration) && audio.duration > 0) {
		progress.value = (audio.currentTime / audio.duration) * 100;
	}
}

function seekTrack() {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
        updateProgress();
    }
}
function changeValume() {
    audio.volume = Number(volume.value);
    volumeValue.textContent = `${Math.round(audio.volume * 100)}%`
}
// Next Track Function
function nextTrack() {
    trackIndex = (trackIndex + 1) % tracks.length;
    loadTrack();
    playTrack()
}

// Previous Track Function
function previousTrack() {
    trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    loadTrack();
    playTrack()
}

// Update Play Button Text
function updateTrack() {
    playButton.textContent = audio.paused ? "▶" : "⏸";
    playButton.setAttribute("aria-label", audio.paused ? "Play" : "Pause");
}
// Show A Helpful Errors
function showError() {
	statusMessage.textContent =  "Unable To Play";
}
loadTrack();

function setupEvents() {
playButton.addEventListener("click", togglePlay);
nextButton.addEventListener("click", nextTrack);
previousButton.addEventListener("click", previousTrack);
progress.addEventListener("input", seekTrack)
volume.addEventListener("input", changeValume)
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", updateDuration);
audio.addEventListener("play", updateTrack);
audio.addEventListener("ended", nextTrack)
audio.addEventListener("pause", updateTrack);
audio.addEventListener("error", showError);
}

// Initialize Function
function initPlayer() {
	setupEvents();
	loadTrack();
	changeValume();
}

initPlayer();