function initVideo(video, url) {
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.addEventListener("loadedmetadata", function () {
      video.play();
    });
  }
}

function initVideos() {
  const videos = [...document.querySelectorAll("[data-stream]")];

  videos.forEach((video) => {
    const stream = video.dataset.stream;
    initVideo(video, stream);
  });
}

function initToggleButtons() {
  document.body.addEventListener("click", (e) => {
    const { target: node } = event;

    if (node.classList.contains("button_toggle")) {
      node.classList.toggle("button_active");
    }
  });
}

function clickSettingsButton() {
  document.body.addEventListener("click", (e) => {
    let { target: node } = event;
    let buttonSettings = null;

    while (node !== document.body) {
      if (node.classList.contains("player__settings-button")) {
        buttonSettings = node;
      }

      if (node.classList.contains("player") && buttonSettings) {
        node.classList.toggle("player_show-settings");
        break;
      }

      node = node.parentNode;
    }
  });
}

function clickVisualizerButton() {
  document.body.addEventListener("click", (e) => {
    let { target: node } = event;
    let buttonVisualizer = null;

    while (node !== document.body) {
      if (node.classList.contains("player__visualizer-button")) {
        buttonVisualizer = node;
      }

      if (node.classList.contains("player") && buttonVisualizer) {
        node.classList.toggle("player_show-visualizer");
        break;
      }

      node = node.parentNode;
    }
  });
}

function initContrastAndBrightness() {
  const players = [...document.querySelectorAll(".player")];

  players.forEach((player) => {
    const brightness = player.querySelector(".player__brightness");
    const contrast = player.querySelector(".player__contrast");
    const video = player.querySelector(".player__video");

    if (!brightness || !contrast || !video) return;

    [brightness, contrast].forEach((input) => {
      input.addEventListener("input", () => {
        video.style.filter = `brightness(${brightness.value}) contrast(${contrast.value})`;
      });
    });
  });
}

function clickFullScreen() {
  document.body.addEventListener("click", (e) => {
    let { target: node } = event;
    let buttonFullScreen = null;

    while (node !== document.body) {
      if (node.classList.contains("player__fullscreen-button")) {
        buttonFullScreen = node;
      }

      if (node.classList.contains("player") && buttonFullScreen) {
        node.classList.toggle("player_fullscreen");
        break;
      }

      node = node.parentNode;
    }
  });
}

function setPlayersStyle() {
  const players = [...document.querySelectorAll(".player")];

  players.forEach((player) => {
    const {
      width,
      height,
      left,
      right,
      top,
      bottom,
    } = player.getBoundingClientRect();

    player.setAttribute(
      "style",
      `
        width: ${width}px;
        height: ${height}px;
        left: ${left}px;
        right: ${right}px;
        top: ${top}px;
        bottom: ${bottom}px;
      `
    );
  });
}

function keyDownEsc() {
  document.addEventListener("keydown", (e) => {
    const players = [...document.querySelectorAll(".player")];

    if (e.keyCode === 27) {
      players.forEach((player) => {
        player.classList.remove("player_fullscreen");
        player
          .querySelector(".player__fullscreen-button")
          .classList.remove("button_active");
      });
    }
  });
}

function visualizer(playerNode) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) console.error("AudioContext not work");
  let audioCtx = null;
  let analyser = null;

  const video = playerNode.querySelector(".player__video");
  const visualizer = playerNode.querySelector(".player__visualizer");
  const canvasVisualizer = visualizer.getContext("2d");

  video.addEventListener("volumechange", () => {
    if (audioCtx) return;

    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    const source = audioCtx.createMediaElementSource(video);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    audioCtx.resume();
    const { width, height } = visualizer.getBoundingClientRect();

    const draw = () => {
      canvasVisualizer.clearRect(0, 0, width, height);

      requestAnimationFrame(draw);
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      let barWidth = 2;
      let x = 0;
      const countBars = Math.floor(width / 3);

      for (let i = 0; i < countBars; i++) {
        canvasVisualizer.fillStyle = "rgb(100, 149, 237)";
        canvasVisualizer.fillRect(x, 0, barWidth, dataArray[i] / 3);

        x += barWidth + 1;
      }
    };

    draw();
  });
}

function renderVisualizers() {
  const players = [...document.querySelectorAll(".player")];

  players.forEach((player) => {
    visualizer(player);
  });
}

function init() {
  initVideos();
  initToggleButtons();
  clickSettingsButton();
  initContrastAndBrightness();
  clickFullScreen();
  setPlayersStyle();
  keyDownEsc();
  clickVisualizerButton();
  renderVisualizers();
}

init();
