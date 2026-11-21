/**
 * THE GRAND BIRTHDAY EXPERIENCE — SCENE CONTROLLER & INTERACTIONS
 * Manages scene transitions, envelope animations, typing reveals,
 * gift box opening, wish modal interactions, and replay flows.
 */

class BirthdaySceneManager {
  constructor(config, audio, particles) {
    this.config = config;
    this.audio = audio;
    this.particles = particles;

    this.currentSceneIndex = 1;
    this.totalScenes = 8;
    this.isTransitioning = false;
    this.letterTyped = false;
    this.typingTimeouts = [];
    this.giftOpened = false;
    this.wishMade = false;

    this.initElements();
    this.populateConfigData();
    this.bindEvents();
    this.showScene(1, false);
  }

  initElements() {
    this.scenes = document.querySelectorAll(".scene");
    this.navDots = document.querySelectorAll(".nav-dot");
    this.transitionOverlay = document.getElementById("transitionOverlay");
    this.envelope = document.getElementById("letterEnvelope");
    this.letterPaper = document.getElementById("letterPaper");
    this.letterContent = document.getElementById("letterBodyText");
    this.giftBox = document.getElementById("giftBox");
    this.giftResult = document.getElementById("giftRevealContent");
    this.wishModal = document.getElementById("wishDetailModal");
  }

  populateConfigData() {
    const cfg = this.config;

    // Recipient & sender everywhere
    document.querySelectorAll(".cfg-recipient-name").forEach((el) => {
      el.textContent = cfg.recipient.nickname;
    });
    document.querySelectorAll(".cfg-recipient-full").forEach((el) => {
      el.textContent = cfg.recipient.fullName;
    });
    document.querySelectorAll(".cfg-sender-name").forEach((el) => {
      el.textContent = cfg.sender.nickname;
    });
    document.querySelectorAll(".cfg-birthdate").forEach((el) => {
      el.textContent = cfg.recipient.birthDate;
    });

    // Populate Wishes (Scene 5)
    const wishesContainer = document.getElementById("wishesContainer");
    if (wishesContainer && cfg.scene5.wishes) {
      wishesContainer.innerHTML = "";
      cfg.scene5.wishes.forEach((w, idx) => {
        const item = document.createElement("div");
        item.className = "wish-crystal";
        item.setAttribute("data-wish-idx", idx);
        item.innerHTML = `
          <div class="crystal-glow"></div>
          <div class="crystal-icon">${w.icon}</div>
          <h3 class="crystal-title">${w.title}</h3>
          <p class="crystal-short">${w.short}</p>
          <span class="crystal-tap-hint">Sentuh untuk membaca</span>
        `;
        item.addEventListener("click", () => this.openWishModal(w));
        wishesContainer.appendChild(item);
      });
    }

    // Populate Scene 3 Hopes
    const hopesContainer = document.getElementById("hopesContainer");
    if (hopesContainer && cfg.scene3.hopes) {
      hopesContainer.innerHTML = "";
      cfg.scene3.hopes.forEach((h) => {
        const card = document.createElement("div");
        card.className = "hope-card";
        card.innerHTML = `
          <div class="hope-number">${h.number}</div>
          <div class="hope-content">
            <h4 class="hope-title">${h.title}</h4>
            <p class="hope-text">"${h.text}"</p>
          </div>
        `;
        hopesContainer.appendChild(card);
      });
    }
  }

  bindEvents() {
    // Scene 01 CTA
    const btnScene1 = document.getElementById("btnOpenSurprise");
    if (btnScene1) {
      btnScene1.addEventListener("click", () => {
        this.audio.play();
        this.goToScene(2);
      });
    }

    // Scene 02 CTA
    const btnScene2 = document.getElementById("btnEnterUniverse");
    if (btnScene2) {
      btnScene2.addEventListener("click", () => this.goToScene(3));
    }

    // Scene 03 CTA
    const btnScene3 = document.getElementById("btnProceedToLetter");
    if (btnScene3) {
      btnScene3.addEventListener("click", () => this.goToScene(4));
    }

    // Scene 04 Letter Events
    const btnOpenLetter = document.getElementById("btnOpenLetter");
    if (btnOpenLetter) {
      btnOpenLetter.addEventListener("click", () => this.openLetter());
    }
    if (this.envelope) {
      this.envelope.addEventListener("click", () => this.openLetter());
    }

    const btnSkipTyping = document.getElementById("btnSkipTyping");
    if (btnSkipTyping) {
      btnSkipTyping.addEventListener("click", () => this.skipLetterTyping());
    }

    const btnAfterLetter = document.getElementById("btnProceedToWishes");
    if (btnAfterLetter) {
      btnAfterLetter.addEventListener("click", () => this.goToScene(5));
    }

    // Scene 05 CTA
    const btnScene5 = document.getElementById("btnProceedToSky");
    if (btnScene5) {
      btnScene5.addEventListener("click", () => this.goToScene(6));
    }

    // Scene 06 Make a Wish Events
    const btnMakeWish = document.getElementById("btnMakeWish");
    if (btnMakeWish) {
      btnMakeWish.addEventListener("click", () => this.triggerMakeWish());
    }
    const btnAfterWish = document.getElementById("btnProceedToGift");
    if (btnAfterWish) {
      btnAfterWish.addEventListener("click", () => this.goToScene(7));
    }

    // Scene 07 Gift Events
    const btnUnwrapGift = document.getElementById("btnUnwrapGift");
    if (btnUnwrapGift) {
      btnUnwrapGift.addEventListener("click", () => this.openGiftBox());
    }
    if (this.giftBox) {
      this.giftBox.addEventListener("click", () => this.openGiftBox());
    }
    const btnAfterGift = document.getElementById("btnProceedToFinale");
    if (btnAfterGift) {
      btnAfterGift.addEventListener("click", () => this.goToScene(8));
    }

    // Scene 08 Replay CTA
    const btnReplay = document.getElementById("btnReplayUniverse");
    if (btnReplay) {
      btnReplay.addEventListener("click", () => this.replayUniverse());
    }

    // Audio button
    const btnMusic = document.getElementById("musicToggleBtn");
    if (btnMusic) {
      btnMusic.addEventListener("click", () => this.audio.toggle());
    }

    // Modal Close
    const btnCloseModal = document.getElementById("closeWishModal");
    if (btnCloseModal) {
      btnCloseModal.addEventListener("click", () => this.closeWishModal());
    }
    if (this.wishModal) {
      this.wishModal.addEventListener("click", (e) => {
        if (e.target === this.wishModal) this.closeWishModal();
      });
    }

    // Navigation Dots
    this.navDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const target = parseInt(dot.getAttribute("data-scene"), 10);
        if (target && target !== this.currentSceneIndex) {
          this.goToScene(target);
        }
      });
    });

    // Touch Swipe Navigation for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      (e) => {
        const diffX = e.changedTouches[0].screenX - touchStartX;
        const diffY = e.changedTouches[0].screenY - touchStartY;
        // Check if horizontal swipe and not scrolling letter
        if (
          Math.abs(diffX) > 75 &&
          Math.abs(diffX) > Math.abs(diffY) * 1.5 &&
          !e.target.closest("#letterPaper") &&
          !e.target.closest("#wishDetailModal")
        ) {
          if (diffX < 0 && this.currentSceneIndex < this.totalScenes) {
            this.goToScene(this.currentSceneIndex + 1);
          } else if (diffX > 0 && this.currentSceneIndex > 1) {
            this.goToScene(this.currentSceneIndex - 1);
          }
        }
      },
      { passive: true }
    );

    // Keyboard navigation (Left / Right Arrow)
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" && this.currentSceneIndex < this.totalScenes) {
        this.goToScene(this.currentSceneIndex + 1);
      } else if (e.key === "ArrowLeft" && this.currentSceneIndex > 1) {
        this.goToScene(this.currentSceneIndex - 1);
      }
    });
  }

  goToScene(targetIndex) {
    if (
      this.isTransitioning ||
      targetIndex < 1 ||
      targetIndex > this.totalScenes ||
      targetIndex === this.currentSceneIndex
    ) {
      return;
    }

    this.isTransitioning = true;
    const currentScene = document.getElementById(`scene-${this.currentSceneIndex}`);
    const nextScene = document.getElementById(`scene-${targetIndex}`);

    // Adjust Particle Atmosphere per scene
    if (this.particles) {
      if (targetIndex === 3) {
        this.particles.setMode("petals");
      } else if (targetIndex === 4) {
        this.particles.setMode("warm");
      } else if (targetIndex === 7) {
        this.particles.setMode("warm");
      } else if (targetIndex === 8) {
        this.particles.setMode("celebration");
      } else {
        this.particles.setMode("stars");
      }
    }

    // Cinematic Fade & Light Bloom
    if (this.transitionOverlay) {
      this.transitionOverlay.classList.add("active");
    }

    setTimeout(() => {
      if (currentScene) currentScene.classList.remove("active");
      if (nextScene) {
        nextScene.classList.add("active");
        nextScene.scrollTop = 0;
      }

      this.currentSceneIndex = targetIndex;
      this.updateNavDots();

      // Trigger scene-specific intro animations
      this.onSceneEnter(targetIndex);

      setTimeout(() => {
        if (this.transitionOverlay) {
          this.transitionOverlay.classList.remove("active");
        }
        this.isTransitioning = false;
      }, 400);
    }, 450);
  }

  showScene(index, animate = false) {
    this.scenes.forEach((s) => s.classList.remove("active"));
    const target = document.getElementById(`scene-${index}`);
    if (target) {
      target.classList.add("active");
    }
    this.currentSceneIndex = index;
    this.updateNavDots();
    this.onSceneEnter(index);
  }

  updateNavDots() {
    this.navDots.forEach((dot) => {
      const idx = parseInt(dot.getAttribute("data-scene"), 10);
      if (idx === this.currentSceneIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  onSceneEnter(sceneIndex) {
    const sceneEl = document.getElementById(`scene-${sceneIndex}`);
    if (!sceneEl) return;

    // Reset scroll of newly active scene
    sceneEl.scrollTop = 0;

    // Auto-spawn shooting star for galaxy scenes
    if ([2, 6, 8].includes(sceneIndex) && this.particles) {
      setTimeout(() => this.particles.spawnShootingStar(true), 600);
    }
  }

  openLetter() {
    if (this.envelope.classList.contains("opened")) return;

    this.envelope.classList.add("opened");
    const envelopeWrapper = document.getElementById("envelopeWrapper");
    if (envelopeWrapper) {
      envelopeWrapper.classList.add("paper-expanded");
    }

    const readBtn = document.getElementById("btnOpenLetter");
    if (readBtn) readBtn.style.display = "none";

    const afterActions = document.getElementById("letterAfterActions");
    if (afterActions) {
      afterActions.style.display = "flex";
    }

    this.startLetterTyping();
  }

  startLetterTyping() {
    const paragraphs = this.config.scene4.paragraphs;
    this.letterContent.innerHTML = "";
    this.typingTimeouts.forEach((t) => clearTimeout(t));
    this.typingTimeouts = [];

    let delay = 150;
    paragraphs.forEach((pText, pIdx) => {
      const p = document.createElement("p");
      p.className = "letter-para";
      p.style.opacity = "0";
      p.style.transform = "translateY(8px)";
      p.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      p.textContent = pText;
      this.letterContent.appendChild(p);

      const timeout = setTimeout(() => {
        p.style.opacity = "1";
        p.style.transform = "translateY(0)";
      }, delay);

      this.typingTimeouts.push(timeout);
      delay += 350; // smooth sequential reading speed
    });

    this.letterTyped = true;
  }

  skipLetterTyping() {
    this.typingTimeouts.forEach((t) => clearTimeout(t));
    this.typingTimeouts = [];
    const paras = this.letterContent.querySelectorAll(".letter-para");
    paras.forEach((p) => {
      p.style.opacity = "1";
      p.style.transform = "translateY(0)";
    });
    const skipBtn = document.getElementById("btnSkipTyping");
    if (skipBtn) skipBtn.style.display = "none";
  }

  openWishModal(wish) {
    if (!this.wishModal) return;
    document.getElementById("modalWishIcon").textContent = wish.icon;
    document.getElementById("modalWishTitle").textContent = wish.title;
    document.getElementById("modalWishDesc").textContent = wish.desc;
    document.getElementById("modalWishDetail").textContent = wish.detail;

    this.wishModal.classList.add("active");
  }

  closeWishModal() {
    if (this.wishModal) {
      this.wishModal.classList.remove("active");
    }
  }

  triggerMakeWish() {
    if (this.wishMade) return;
    this.wishMade = true;

    const btn = document.getElementById("btnMakeWish");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-star">✦</span> Permohonan Diterbangkan...`;
    }

    const scene6El = document.getElementById("scene-6");
    if (scene6El) {
      scene6El.classList.add("wishing-active");
    }

    // Launch dramatic shooting stars burst
    if (this.particles) {
      this.particles.triggerWishMeteorShower();
    }

    // After animation reveal the quotes
    setTimeout(() => {
      const resultArea = document.getElementById("wishResultArea");
      if (resultArea) {
        resultArea.classList.add("visible");
      }
      if (btn) {
        btn.style.display = "none";
      }
    }, 1800);
  }

  openGiftBox() {
    if (this.giftOpened) return;
    this.giftOpened = true;

    if (this.giftBox) {
      this.giftBox.classList.add("opened");
    }

    const rect = this.giftBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Burst luxury gold & rose confetti
    if (this.particles) {
      this.particles.triggerConfettiBurst(centerX, centerY);
      setTimeout(() => {
        this.particles.triggerConfettiBurst(centerX - 40, centerY - 20);
        this.particles.triggerConfettiBurst(centerX + 40, centerY - 20);
      }, 350);
    }

    const unwrapBtn = document.getElementById("btnUnwrapGift");
    if (unwrapBtn) {
      unwrapBtn.style.display = "none";
    }

    setTimeout(() => {
      if (this.giftResult) {
        this.giftResult.classList.add("visible");
      }
    }, 700);
  }

  replayUniverse() {
    // Reset state
    this.wishMade = false;
    this.giftOpened = false;

    // Reset envelope
    if (this.envelope) this.envelope.classList.remove("opened");
    const envelopeWrapper = document.getElementById("envelopeWrapper");
    if (envelopeWrapper) envelopeWrapper.classList.remove("paper-expanded");
    const readBtn = document.getElementById("btnOpenLetter");
    if (readBtn) readBtn.style.display = "inline-flex";
    const afterActions = document.getElementById("letterAfterActions");
    if (afterActions) afterActions.style.display = "none";
    const skipBtn = document.getElementById("btnSkipTyping");
    if (skipBtn) skipBtn.style.display = "inline-block";

    // Reset Scene 6
    const btnMakeWish = document.getElementById("btnMakeWish");
    if (btnMakeWish) {
      btnMakeWish.disabled = false;
      btnMakeWish.style.display = "inline-flex";
      btnMakeWish.innerHTML = `<span>Make a wish</span>`;
    }
    const scene6El = document.getElementById("scene-6");
    if (scene6El) scene6El.classList.remove("wishing-active");
    const wishResultArea = document.getElementById("wishResultArea");
    if (wishResultArea) wishResultArea.classList.remove("visible");

    // Reset Gift
    if (this.giftBox) this.giftBox.classList.remove("opened");
    const unwrapBtn = document.getElementById("btnUnwrapGift");
    if (unwrapBtn) unwrapBtn.style.display = "inline-flex";
    if (this.giftResult) this.giftResult.classList.remove("visible");

    // Navigate to Scene 1
    this.goToScene(1);
  }
}

window.BirthdaySceneManager = BirthdaySceneManager;
