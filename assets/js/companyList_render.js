/* =========================================================
   Company List Render
========================================================= */

async function loadCompanyList() {
    try {
        const res = await fetch("/assets/data/company-list.json");
        const data = await res.json();
        const wrap = document.getElementById("companyCardWrap");
        let html = "";
        data.forEach(company => {
            html += `
        <a href="/subpage/company-detail.html?id=${company.id}"
           class="company-card">
          <div class="company-card__logo">
            <img src="${company.logo}" alt="${company.name}">
          </div>
          <p class="company-card__name">
            ${company.name}
          </p>

        </a>
      `;
        });
        wrap.innerHTML = html;
    } catch (err) {
        console.error("기업 리스트 로드 실패", err);
    }
}
/* 실행 */
document.addEventListener("DOMContentLoaded", loadCompanyList);
