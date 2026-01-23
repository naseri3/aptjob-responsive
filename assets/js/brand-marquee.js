document.addEventListener('DOMContentLoaded', () => {
  ['brandTrackTop', 'brandTrackBottom'].forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;

    const items = Array.from(track.children);

    // 무한 루프용 복제
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  });
});