document.addEventListener("DOMContentLoaded", () => {

  const root = document.getElementById("applyStatus");
  if (!root) return;

  const progress = root.querySelector(".gauge__progress");
  const valueEl = document.getElementById("competitionRate");

  const apply = Number(root.dataset.apply || 0);
  const limit = Number(root.dataset.limit || 1);

  const rate = apply / limit;
  const maxRate = 20;
  const percent = Math.min(rate / maxRate, 1);

  const pathLength = progress.getTotalLength();
  const targetOffset = pathLength * (1 - percent);

  let intervalId = null;

  function animateGauge() {

    // 1️⃣ 초기화
    progress.style.transition = "none";
    progress.style.strokeDasharray = pathLength;
    progress.style.strokeDashoffset = pathLength;

    progress.getBoundingClientRect(); // 강제 리플로우

    // 2️⃣ 애니메이션 시작
    progress.style.transition = "stroke-dashoffset 1.4s ease";
    progress.style.strokeDashoffset = targetOffset;

    valueEl.textContent = `${limit}:${apply}`;
  }

  // 👀 화면에 보일 때 실행
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        animateGauge();

        // 30초마다 반복
        if (!intervalId) {
          intervalId = setInterval(() => {
            animateGauge();
          }, 30000);
        }
      }
    });
  }, { threshold: 0.4 });

  observer.observe(root);
});



document.addEventListener("DOMContentLoaded", () => {

  const root = document.getElementById("genderStatus");
  if (!root) return;

  const female = Number(root.dataset.female || 0);
  const male = Number(root.dataset.male || 0);
  const total = female + male;

  const femalePath = root.querySelector(".gauge__female");
  const malePath = root.querySelector(".gauge__male");
  const valueEl = document.getElementById("genderRate");

  const pathLength = femalePath.getTotalLength();

  let intervalId = null;

  function animateGenderGauge() {

    if (total === 0) return;

    const femalePercent = female / total;
    const malePercent = male / total;

    const femaleLen = pathLength * femalePercent;
    const maleLen = pathLength * malePercent;

    // 초기화
    [femalePath, malePath].forEach(path => {
      path.style.transition = "none";
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
    });

    femalePath.getBoundingClientRect(); // reflow

    // 애니메이션 활성화
    femalePath.style.transition = "stroke-dashoffset 1.4s ease";
    malePath.style.transition = "stroke-dashoffset 1.4s ease";

    // 👩 여자: 왼쪽 시작
    femalePath.style.strokeDashoffset = pathLength - femaleLen;

    // 👨 남자: 오른쪽 시작 (반대로 계산)
    malePath.style.strokeDashoffset = pathLength - maleLen;

    valueEl.textContent =
      `${Math.round(femalePercent * 100)}% / ${Math.round(malePercent * 100)}%`;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        animateGenderGauge();

        if (!intervalId) {
          intervalId = setInterval(() => {
            animateGenderGauge();
          }, 30000);
        }
      }
    });
  }, { threshold: 0.4 });

  observer.observe(root);

});