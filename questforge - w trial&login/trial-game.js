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

const trialQuestions = [
  {
    question: "Which data type is used to store decimal values in Java?",
    options: ["int", "char", "double", "boolean"],
    correct: 2,
    hint: "It is commonly used for numbers with decimal points."
  },
  {
    question: "Which keyword is used to create a class in Java?",
    options: ["define", "function", "class", "object"],
    correct: 2,
    hint: "It is the same word used in OOP discussions."
  },
  {
    question: "Which symbol is used to end a statement in Java?",
    options: [":", ".", ";", ","],
    correct: 2,
    hint: "It is called a semicolon."
  },
  {
    question: "Which method is the entry point of a Java program?",
    options: ["start()", "main()", "run()", "init()"],
    correct: 1,
    hint: "It usually includes String[] args."
  },
  {
    question: "Which of these is used to print text in Java?",
    options: ["echo()", "print()", "System.out.println()", "console.write()"],
    correct: 2,
    hint: "It starts with System.out."
  },
  {
    question: "Which data type is used for true or false values?",
    options: ["boolean", "int", "String", "float"],
    correct: 0,
    hint: "Its values are only true and false."
  },
  {
    question: "Which operator is used for addition in Java?",
    options: ["*", "+", "-", "/"],
    correct: 1,
    hint: "It is the same symbol used in basic math."
  },
  {
    question: "What do we call a reusable block of code in Java?",
    options: ["variable", "method", "array", "package"],
    correct: 1,
    hint: "You can call it many times in one class."
  },
  {
    question: "Which keyword is used to declare a variable that cannot change?",
    options: ["final", "static", "const", "fixed"],
    correct: 0,
    hint: "It is a common Java keyword for constants."
  },
  {
    question: "Which of these is a correct Java loop?",
    options: ["repeat", "foreach", "for", "loop"],
    correct: 2,
    hint: "It has three parts inside parentheses."
  }
];

let currentTrialQuestion = 0;
let trialLives = 3;
let trialHints = 3;
let trialCorrectAnswers = 0;
let trialBattleFinished = false;

const trialQuestionEl = document.getElementById("trialQuestion");
const trialResultEl = document.getElementById("trialResult");
const trialCounterEl = document.getElementById("trialCounter");
const trialLivesEl = document.getElementById("trialLives");
const trialHintsEl = document.getElementById("trialHints");
const trialHintBtn = document.getElementById("trialHintBtn");
const trialOptionButtons = document.querySelectorAll(".trial-option-btn");
const xpFill = document.getElementById("xpFill");
const trialFinishBox = document.getElementById("trialFinishBox");
const trialSummaryText = document.getElementById("trialSummaryText");
const toast = document.getElementById("toast");

function renderLives() {
  if (!trialLivesEl) return;
  trialLivesEl.textContent = trialLives > 0 ? "❤️ ".repeat(trialLives).trim() : "No Lives";
}

function renderHints() {
  if (!trialHintsEl) return;
  trialHintsEl.textContent = trialHints > 0 ? "✦ ".repeat(trialHints).trim() : "No Hints";
}

function renderBossHp() {
  if (!xpFill) return;
  const total = trialQuestions.length;
  const bossPercent = Math.max(0, 100 - Math.round((currentTrialQuestion / total) * 100));
  xpFill.style.width = `${bossPercent}%`;
}

function updateTrialCounter() {
  if (!trialCounterEl) return;
  const displayNumber = Math.min(currentTrialQuestion + 1, trialQuestions.length);
  trialCounterEl.textContent = `${displayNumber} / ${trialQuestions.length}`;
}

function resetOptionButtons() {
  trialOptionButtons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("correct", "wrong", "eliminated");
    btn.style.cursor = "pointer";
    btn.style.visibility = "visible";
  });
}

function loadTrialQuestion() {
  if (
    !trialQuestionEl ||
    !trialOptionButtons.length ||
    currentTrialQuestion >= trialQuestions.length ||
    trialBattleFinished
  ) {
    return;
  }

  const q = trialQuestions[currentTrialQuestion];

  trialQuestionEl.textContent = q.question;
  updateTrialCounter();
  renderLives();
  renderHints();
  renderBossHp();
  resetOptionButtons();

  q.options.forEach((option, index) => {
    if (trialOptionButtons[index]) {
      trialOptionButtons[index].textContent = option;
      trialOptionButtons[index].onclick = () => handleTrialAnswer(index);
    }
  });

  if (trialHintBtn) {
    trialHintBtn.disabled = trialHints <= 0;
    trialHintBtn.textContent = trialHints > 0 ? "Use Hint" : "No Hints Left";
  }
}

function handleTrialAnswer(selectedIndex) {
  if (trialBattleFinished) return;

  const q = trialQuestions[currentTrialQuestion];
  const correctIndex = q.correct;

  trialOptionButtons.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  });

  if (selectedIndex === correctIndex) {
    trialCorrectAnswers++;
    trialOptionButtons[selectedIndex].classList.add("correct");
    if (trialResultEl) {
      trialResultEl.innerHTML = "✅ Correct! The boss took damage.";
      trialResultEl.style.color = "#8dffad";
    }
  } else {
    trialLives--;
    trialOptionButtons[selectedIndex].classList.add("wrong");
    trialOptionButtons[correctIndex].classList.add("correct");

    if (trialResultEl) {
      trialResultEl.innerHTML = "❌ Wrong answer. You lost 1 life.";
      trialResultEl.style.color = "#ff9ba4";
    }
  }

  renderLives();

  setTimeout(() => {
    currentTrialQuestion++;

    if (trialLives <= 0 || currentTrialQuestion >= trialQuestions.length) {
      finishTrialBattle();
    } else {
      loadTrialQuestion();
    }
  }, 1200);
}

function useTrialHint() {
  if (trialBattleFinished || trialHints <= 0) return;

  const q = trialQuestions[currentTrialQuestion];
  let removed = 0;

  trialOptionButtons.forEach((btn, index) => {
    if (index !== q.correct && removed < 2 && !btn.disabled) {
      btn.disabled = true;
      btn.classList.add("eliminated");
      btn.style.cursor = "not-allowed";
      removed++;
    }
  });

  trialHints--;
  renderHints();

  if (trialResultEl) {
    trialResultEl.innerHTML = `💡 Hint used: ${q.hint}`;
    trialResultEl.style.color = "#f4d26d";
  }

  if (trialHintBtn) {
    trialHintBtn.disabled = trialHints <= 0;
    trialHintBtn.textContent = trialHints > 0 ? "Use Hint" : "No Hints Left";
  }
}

function finishTrialBattle() {
  trialBattleFinished = true;

  if (xpFill) {
    const remainingBossHp = Math.max(0, 100 - Math.round((trialCorrectAnswers / trialQuestions.length) * 100));
    xpFill.style.width = `${remainingBossHp}%`;
  }

  trialOptionButtons.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  });

  if (trialHintBtn) {
    trialHintBtn.disabled = true;
    trialHintBtn.textContent = "Trial Finished";
  }

  const passed = trialCorrectAnswers > 0;

  if (trialResultEl) {
    if (trialLives <= 0) {
      trialResultEl.innerHTML = "☠️ Trial over. Your lives ran out.";
      trialResultEl.style.color = "#ff9ba4";
    } else {
      trialResultEl.innerHTML = "🏆 Trial battle complete!";
      trialResultEl.style.color = "#8dffad";
    }
  }

  if (trialSummaryText) {
    trialSummaryText.textContent =
      `You answered ${trialCorrectAnswers} out of ${trialQuestions.length} correctly. ` +
      `Now you can continue to login and download QuestForge.`;
  }

  if (trialFinishBox) {
    trialFinishBox.classList.add("show");
  }

  if (toast && passed) {
    toast.textContent = "Trial Boss Battle Complete!";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  if (trialCounterEl) {
    trialCounterEl.textContent = `${trialQuestions.length} / ${trialQuestions.length}`;
  }
}

if (trialHintBtn) {
  trialHintBtn.addEventListener("click", useTrialHint);
}

if (trialQuestionEl && trialOptionButtons.length) {
  loadTrialQuestion();
}