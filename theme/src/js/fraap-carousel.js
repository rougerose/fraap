import Swiper, { Navigation, Pagination } from "swiper";
// import Swiper from "swiper";

const fraapCarouselInit = (el) => {
  let carousel = new Swiper(el, {
    modules: [Pagination, Navigation],
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
  });
};

const fraapCarousel = {
  init: fraapCarouselInit,
};


let carousels = document.querySelectorAll(".swiper");

if (carousels.length) {
  carousels.forEach((carousel) => {
    fraapCarousel.init(carousel);
  });
}
