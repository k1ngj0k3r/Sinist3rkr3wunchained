document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('kr3w-live-ticker')) return;

  const ticker = document.createElement('div');
  ticker.id = 'kr3w-live-ticker';
  ticker.setAttribute('role', 'region');
  ticker.setAttribute('aria-label', 'Sinist3rKr3w news ticker');

  ticker.innerHTML = `
    <div class="kr3w-ticker-label">🔴 KR3W WIRE</div>
    <div class="kr3w-ticker-window">
      <div class="kr3w-ticker-track">
        📰 SINIST3RKR3W NEWS •
        📈 MARKET UPDATES COMING SOON •
        🌎 WORLD HEADLINES COMING SOON •
        ⚠️ SERVICE STATUS UPDATES COMING SOON •
        📻 SINIST3RKR3W RADIO •
        🖤 WHERE YOU MATTER MOST
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #kr3w-live-ticker {
      position: fixed;
      bottom: 70px;
      left: 0;
      width: 100%;
      z-index: 9999;
      display: flex;
      align-items: center;
      background: #09090d;
      color: white;
      border-top: 2px solid #e11d48;
      font: 12px Arial, sans-serif;
      box-sizing: border-box;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    .kr3w-ticker-label {
      flex-shrink: 0;
      padding: 12px 10px;
      background: #991b1b;
      font-weight: bold;
      white-space: nowrap;
    }

    .kr3w-ticker-window {
      overflow: hidden;
      flex: 1;
    }

    .kr3w-ticker-track {
      display: inline-block;
      white-space: nowrap;
      padding-left: 100%;
      animation: kr3w-scroll 65s linear infinite;
    }

    @keyframes kr3w-scroll {
      to { transform: translateX(-100%); }
    }

    #kr3w-live-ticker:hover .kr3w-ticker-track {
      animation-play-state: paused;
    }

    @media (prefers-reduced-motion: reduce) {
      .kr3w-ticker-track {
        animation: none;
        padding-left: 12px;
      }
      .kr3w-ticker-window {
        overflow-x: auto;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(ticker);
});

// =========================
// KR3W WIRE — NEWS HEADLINES
// =========================
document.addEventListener('DOMContentLoaded', async () => {
  const track = document.querySelector('.kr3w-ticker-track');

  if (!track) return;

  try {
    const response = await fetch(
      'data/headlines.json?t=' + Date.now(),
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Headlines unavailable');
    }

    const data = await response.json();

    if (!Array.isArray(data.headlines) || !data.headlines.length) {
      return;
    }

    const headlines = data.headlines.slice(0, 10);

    track.replaceChildren();

    const intro = document.createElement('span');
    intro.textContent = '🔴 KR3W WIRE • 🖤 SINIST3RKR3W NEWS • ';
    track.appendChild(intro);

    headlines.forEach(item => {
      const link = document.createElement('a');

      link.textContent = `🌎 ${item.title} • `;
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      link.style.color = '#ffffff';
      link.style.textDecoration = 'none';
      link.style.marginRight = '20px';

      track.appendChild(link);
    });

  } catch (error) {
    console.warn('KR3W WIRE:', error.message);
  }
});
