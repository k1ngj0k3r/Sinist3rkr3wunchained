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
