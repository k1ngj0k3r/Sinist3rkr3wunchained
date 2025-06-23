// NEXT-LEVEL 4.0 ENHANCEMENTS for Sinist3rkr3w Unchained
// -----------------------------------------------------

// =================== FLAME PARTICLES ===================
function createFlame() {
  const flame = document.createElement('div');
  flame.classList.add('flame-particle');
  flame.style.left = Math.random() * window.innerWidth + 'px';
  flame.style.animationDuration = (2 + Math.random() * 3) + 's';
  document.body.appendChild(flame);
  setTimeout(() => flame.remove(), 5000);
}
setInterval(createFlame, 150);

// =================== FLOATING QUOTES ===================
const quotes = [
  "Rise from the ashes.",
  "Break the chains.",
  "Speak your truth.",
  "Move like the flames.",
  "Be sharp. Be loud. Be UNCHAINED."
];
function showFloatingQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const elem = document.createElement('div');
  elem.classList.add('floating-quote');
  elem.textContent = quote;
  document.body.appendChild(elem);
  setTimeout(() => elem.remove(), 4000);
}
setInterval(showFloatingQuote, 10000);

// =================== SOUND ON HOVER ===================
const hoverSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6673"); // Replace with your sound link
function addHoverSound() {
  const hoverElements = document.querySelectorAll('.cta, .nav a');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      hoverSound.play();
    });
  });
}
document.addEventListener('DOMContentLoaded', addHoverSound);

// =================== BACKGROUND MUSIC BUTTON ===================
const music = new Audio("https://www.fesliyanstudios.com/play-mp3/6679"); // Replace with your music link
music.loop = true;

const musicButton = document.createElement("button");
musicButton.textContent = "🎵 Play Music";
musicButton.classList.add("btn");
musicButton.style.position = "fixed";
musicButton.style.top = "10px";
musicButton.style.right = "10px";
musicButton.onclick = function() {
  if (music.paused) {
    music.play();
    musicButton.textContent = "⏸️ Pause Music";
  } else {
    music.pause();
    musicButton.textContent = "🎵 Play Music";
  }
};
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(musicButton);
});

// =================== THEME TOGGLE BUTTON ===================
const themeButton = document.createElement("button");
themeButton.textContent = "🌙 Toggle Theme";
themeButton.classList.add("btn");
themeButton.style.position = "fixed";
themeButton.style.top = "60px";
themeButton.style.right = "10px";
themeButton.onclick = function() {
  if (document.body.style.backgroundColor === "black") {
    document.body.style.backgroundColor = "#660000"; // Dark Red
  } else {
    document.body.style.backgroundColor = "black";
  }
};
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(themeButton);
});
