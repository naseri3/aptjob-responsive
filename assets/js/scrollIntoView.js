document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(
    "#director, #job-board, #recruitment-process, #company-intro"
  );

  tabs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const headerOffset = 30;
      const offsetPosition = targetEl.offsetTop - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 330;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop) {
        tabs.forEach((btn) => {
          btn.classList.remove("active");
          if (btn.dataset.target === sectionId) {
            btn.classList.add("active");
          }
        });
      }
    });
  });
});
