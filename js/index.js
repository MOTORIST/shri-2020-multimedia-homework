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

function init() {
  initVideos();
  initToggleButtons();
  clickSettingsButton();
  initContrastAndBrightness();
  clickFullScreen();
  setPlayersStyle();
  keyDownEsc();
}

init();
