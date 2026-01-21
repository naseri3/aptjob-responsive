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
        <li><strong>지역 : </strong> ${item.location}</li>
        <li><strong>직무 : </strong>${item.job}</li>
        <li><strong>경력 : </strong>${item.experience} | <strong>학력 : </strong>${item.education}</li>
        <li><strong>급여 : </strong>${item.salary}</li>
      </ul>

      <div class="premium-card__bottom">
        <span class="premium-card__btn">상세보기</span>
        <span class="premium-card__period">${item.period}</span>
      </div>
    </div>
  </a>
`).join("");
