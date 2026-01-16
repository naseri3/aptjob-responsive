/** header, footer */
(function () {
    const isSub = location.pathname.includes("/subPage/");
    const pathPrefix = isSub ? "../" : "./";

    // ✅ header
    const headerEl = document.querySelector("#headerWrap");
    if (headerEl) {
        fetch(pathPrefix + "assets/components/header.html", { cache: "no-store" })
        .then(res => res.text())
        .then(html => {
            headerEl.innerHTML = html;
            fixRelativePaths(headerEl);
        })
        .catch(err => console.error("Header load error:", err));
    }

    // ✅ footer
    const footerEl = document.querySelector("#footer");
    if (footerEl) {
        fetch(pathPrefix + "assets/components/footer.html", { cache: "no-store" })
        .then(res => res.text())
        .then(html => {
            footerEl.innerHTML = html;
            fixRelativePaths(footerEl);
        })
        .catch(err => console.error("Footer load error:", err));
    }

    // ✅ 경로 자동 보정 함수
    function fixRelativePaths(container) {
        container.querySelectorAll("img, a, link").forEach(el => {
        ["src", "href"].forEach(attr => {
            if (el.hasAttribute(attr)) {
            const val = el.getAttribute(attr);
            if (val && !val.startsWith("http") && !val.startsWith("#")) {
                if (val.startsWith("assets/")) {
                el.setAttribute(attr, pathPrefix + val);
                } else if (val.startsWith("/assets/")) {
                el.setAttribute(attr, pathPrefix + val.replace(/^\//, ""));
                }
            }
            }
        });
        });
    }
})();



/* 위로가기 버튼 */
document.addEventListener("DOMContentLoaded",()=>{var a=document.getElementById("backToTop");if(!a)return;window.addEventListener("scroll",()=>{window.scrollY>300?a.classList.add("show"):a.classList.remove("show")}),a.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})})});
