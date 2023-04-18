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

// simular pulsación del botón
function Press(button) {
    button.style.borderRadius = '30%';
}

// simular liberación del botón
function Release(button) {
    button.style.borderRadius = '';
}

// Desactivar FF si estaba, sino no pasa nada
function NoMoreFastFordward() {
    fwd.classList.remove('active');
    clearInterval(intervalFwd);
    Release(fwd);
}

// Desactivar RW si estaba, sino no pasa nada
function NoMoreRewind() {
    rwd.classList.remove('active');
    clearInterval(intervalRwd);
    Release(rwd);
}

function playPauseMedia() {
    if (media.paused) {
        play_i.classList.remove('fa-play');
        play_i.classList.add('fa-pause');
        media.play();
        Press(play);
    } else {
        play_i.classList.remove('fa-pause');
        play_i.classList.add('fa-play');
        media.pause();
        Release(play);
    }
    NoMoreFastFordward();
    NoMoreRewind();
}

function stopMedia() {
    NoMoreFastFordward();
    NoMoreRewind();
    Release(play);
    media.pause();
    media.currentTime = 0;
    play_i.classList.remove('fa-pause');
    play_i.classList.add('fa-play');
}

let intervalFwd;
let intervalRwd;

function mediaBackward() {
    NoMoreFastFordward();
    if (rwd.classList.contains('active')) {
        NoMoreRewind();
        if (play_i.classList.contains('fa-pause')) // si estaba en modo play
            media.play();
    } else {
        rwd.classList.add('active');
        media.pause();
        Press(rwd);
        intervalRwd = setInterval(windBackward, 200);
    }
}

function mediaForward() {
    NoMoreRewind();
    if (fwd.classList.contains('active')) {
        NoMoreFastFordward();
        if (play_i.classList.contains('fa-pause')) // si estaba en modo play
            media.play();
    } else {
        fwd.classList.add('active');
        media.pause();
        Press(fwd);
        intervalFwd = setInterval(windForward, 200);
    }
}

function windBackward() {
    if (media.currentTime <= 3) {
        NoMoreRewind();
        stopMedia();
    } else {
        media.currentTime -= 3;
    }
}

function windForward() {
    if (media.currentTime >= media.duration - 3) {
        NoMoreFastFordward();
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

media.removeAttribute('controls'); // quitar los controles por defecto
controls.style.visibility = 'visible';