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
const player = document.querySelector('.player');
let totalMediaTime = '??:??'; // Para almacenar como cadena duración video

const inputVideo = document.querySelector('#loadedvideo');

inputVideo.addEventListener('change', newVideoLoaded);

function newVideoLoaded(e) {
    console.log('Cargado el video');
    const file = this.files[0];
    const type = file.type;
    let canPlay = media.canPlayType(type);

    if (canPlay === '') canPlay = 'no';
    const message = 'Can play type "' + type + '": ' + canPlay;
    const isError = canPlay === 'no';
    if (isError) {
        // detener video actual, regresar fondo y restablecer todo
        console.log(message);
        media.classList.add("novideoloaded");
        totalMediaTime = '??:??';
        stopMedia();
        media.src = "";
        return;
    }

    const fileURL = URL.createObjectURL(file);
    media.src = fileURL;
    media.classList.remove("novideoloaded");
}

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
    if (media.readyState > 0)
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
    timerBar.style.width = 0;
    timer.textContent = '00:00' + '/' + totalMediaTime;
}

let intervalFwd;
let intervalRwd;

function mediaBackward() {
    NoMoreFastFordward();
    if (media.readyState > 0)
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
    if (media.readyState > 0)
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
    if (media.readyState > 0)
        if (media.currentTime <= 3) {
            NoMoreRewind();
            stopMedia();
        } else {
            media.currentTime -= 3;
        }
}

function windForward() {
    if (media.readyState > 0)
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
    timer.textContent = mediaTime + '/' + totalMediaTime;

    const barLength = timerWrapper.clientWidth * (media.currentTime / media.duration);
    timerBar.style.width = `${barLength}px`;
}

// Calcular la duración total del video en formato minutos:segundos
function calcularTiempo() {
    const totalMinutes = Math.floor(media.duration / 60);
    const totalSeconds = Math.floor(media.duration - totalMinutes * 60);
    const totalMinuteValue = totalMinutes.toString().padStart(2, '0');
    const totalSecondValue = totalSeconds.toString().padStart(2, '0');
    totalMediaTime = `${totalMinuteValue}:${totalSecondValue}`;
    timer.textContent = '00:00' + '/' + totalMediaTime;
}

// Calcular nueva posición a reproducir al dar clic sobre barra progreso
function moveToTimeOffset(e) {
    if (media.readyState > 0) {
        x = e.clientX; // posic clickeada en timeWrapper
        op = player.offsetLeft; // posic relativa del player dentro del padre
        ot = timerWrapper.offsetLeft; // posic relativa del timeWrapper en player
        w = this.clientWidth; // ancho de la barra progreso
        porc = (x - op - ot) / w * 100; // porc que representa la posic clickeada
        tiempTotal = media.duration; // duraccion (segundos) del video
        nuevaPosic = Math.floor(tiempTotal * porc / 100); // nueva posic a reproducir
        media.currentTime = nuevaPosic;
    }
}

media.addEventListener('loadedmetadata', calcularTiempo);
media.addEventListener('timeupdate', setTime);

rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);

stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);

timerWrapper.addEventListener('click', moveToTimeOffset);

media.removeAttribute('controls'); // quitar los controles por defecto
controls.style.visibility = 'visible';