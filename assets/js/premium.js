import { premiumList } from "./premiumList.js";

const grid = document.querySelector(".premium__grid");

grid.innerHTML = premiumList.map(item => `
  <a href="${item.link}" class="premium-card">
    <div class="premium-card__top">
      ${item.complex}
    </div>

    <div class="premium-card__body">
      <h3 class="premium-card__title">${item.title}</h3>

      <ul class="premium-card__info">
        <li>${item.location}</li>
        <li>${item.job}</li>
        <li>${item.career}</li>
        <li>${item.salary}</li>
      </ul>

      <div class="premium-card__bottom">
        <span class="premium-card__btn">상세보기</span>
        <span class="premium-card__period">${item.period}</span>
      </div>
    </div>
  </a>
`).join("");
