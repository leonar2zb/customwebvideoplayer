const media = document.querySelector('video');
const controls = document.querySelector('.controls');

const play = document.querySelector('.play');
const play_i = document.querySelector('.play i');
const stop = document.querySelector('.stop');
const rwd = document.querySelector('.rwd');
const fwd = document.querySelector('.fwd');

const timerWrapper = document.querySelector('.timer');
const timer = document.querySelector('.timer span');
const timerBar = document.querySelector('.timer div');

play.addEventListener('click', playPauseMedia);

function playPauseMedia() {
    if (media.paused) {
        play_i.classList.remove('fa-play');
        play_i.classList.add('fa-pause');
        media.play();
    } else {
        play_i.classList.remove('fa-pause');
        play_i.classList.add('fa-play');
        media.pause();
    }
}

function stopMedia() {
    rwd.classList.remove('active');
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);

    media.pause();
    media.currentTime = 0;
    play_i.classList.remove('fa-pause');
    play_i.classList.add('fa-play');
}

let intervalFwd;
let intervalRwd;

function mediaBackward() {
    clearInterval(intervalFwd);
    fwd.classList.remove('active');

    if (rwd.classList.contains('active')) {
        rwd.classList.remove('active');
        clearInterval(intervalRwd);
        media.play();
    } else {
        rwd.classList.add('active');
        media.pause();
        intervalRwd = setInterval(windBackward, 200);
    }
}

function mediaForward() {
    clearInterval(intervalRwd);
    rwd.classList.remove('active');

    if (fwd.classList.contains('active')) {
        fwd.classList.remove('active');
        clearInterval(intervalFwd);
        media.play();
    } else {
        fwd.classList.add('active');
        media.pause();
        intervalFwd = setInterval(windForward, 200);
    }
}

function windBackward() {
    if (media.currentTime <= 3) {
        rwd.classList.remove('active');
        clearInterval(intervalRwd);
        stopMedia();
    } else {
        media.currentTime -= 3;
    }
}

function windForward() {
    if (media.currentTime >= media.duration - 3) {
        fwd.classList.remove('active');
        clearInterval(intervalFwd);
        stopMedia();
    } else {
        media.currentTime += 3;
    }
}

function setTime() {
    const minutes = Math.floor(media.currentTime / 60);
    const seconds = Math.floor(media.currentTime - minutes * 60);

    const minuteValue = minutes.toString().padStart(2, '0');
    const secondValue = seconds.toString().padStart(2, '0');

    const mediaTime = `${minuteValue}:${secondValue}`;
    timer.textContent = mediaTime;

    const barLength = timerWrapper.clientWidth * (media.currentTime / media.duration);
    timerBar.style.width = `${barLength}px`;
}

media.addEventListener('timeupdate', setTime);

rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);

stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);

media.removeAttribute('controls');
controls.style.visibility = 'visible';