// QuestForge enhanced animations and trial game

const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {
  if (glow) {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }

  document.querySelectorAll(".feature-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
  observer.observe(el);
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

function answerTrial(button, correct) {
  const result = document.getElementById("trialResult");
  const xp = document.getElementById("xpFill");
  const toast = document.getElementById("toast");
  const buttons = document.querySelectorAll(".trial-options button");

  buttons.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  });

  if (correct) {
    button.classList.add("correct");
    result.innerHTML = "✅ Correct! You earned <strong>+20 XP</strong> and unlocked a badge preview.";
    result.style.color = "#8dffad";
    if (xp) xp.style.width = "100%";
    if (toast) {
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2600);
    }
  } else {
    button.classList.add("wrong");
    result.innerHTML = "❌ The boss blocked your answer. Download QuestForge to retry the full battle.";
    result.style.color = "#ff9ba4";
    if (xp) xp.style.width = "28%";
  }

  setTimeout(() => {
    buttons.forEach((btn) => {
      btn.disabled = false;
      btn.style.cursor = "pointer";
      btn.classList.remove("correct", "wrong");
    });
  }, 3000);
}
