/**
 * THE GRAND BIRTHDAY EXPERIENCE — MAIN ENTRY POINT
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.BIRTHDAY_CONFIG || {};

  // 1. Initialize Particles Engine
  const particles = new window.BirthdayParticles("universeCanvas");

  // 2. Initialize Audio Engine
  const audio = new window.BirthdayAudio(config.audio);

  // 3. Initialize Scene Manager
  const sceneManager = new window.BirthdaySceneManager(config, audio, particles);

  // 4. Subtle desktop interactive cursor glow (disabled on touch/mobile)
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 768;

  if (!isTouchDevice) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-ambient-glow";
    document.body.appendChild(cursorGlow);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
    );

    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(updateCursor);
    };
    updateCursor();
  }

  // 5. Hide Preloader gracefully
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.remove();
      }, 700);
    }, 600);
  }

  // Log elegant console greeting
  console.log(
    `%c✨ The Grand Birthday Experience ✨\n%c"The world is a little more beautiful with you."\nMade with love by ${config.sender?.nickname || "Abg"} for ${config.recipient?.nickname || "Bocil"}`,
    "color: #D8BD83; font-size: 16px; font-weight: bold; font-family: serif;",
    "color: #FFF8EC; font-size: 12px; font-style: italic;"
  );
});
