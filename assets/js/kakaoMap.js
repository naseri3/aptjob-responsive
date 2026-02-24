/* ======================================================
   카카오 지도 (job-detail 전용)
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const locationTab = document.getElementById("location-tab");
    if (!locationTab) return;

    let map;
    let marker;

    function initMap() {

        const addressEl = document.querySelector(
            "#apartment .job-spec__row:first-child .job-spec__value"
        );

        if (!addressEl) return;

        const address = addressEl.textContent.trim();

        const mapOption = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 3
        };

        map = new kakao.maps.Map(mapContainer, mapOption);

        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, function (result, status) {

            if (status === kakao.maps.services.Status.OK) {

                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:6px;font-size:13px;">${address}</div>`
                });

                infowindow.open(map, marker);
                map.setCenter(coords);

                // 탭 안에서 렌더링 문제 해결
                setTimeout(() => {
                    map.relayout();
                }, 300);
            }
        });
    }

    // 탭 클릭 시 지도 생성
    locationTab.addEventListener("shown.bs.tab", function () {

        if (!map) {
            initMap();
        } else {
            map.relayout();
        }

    });

});