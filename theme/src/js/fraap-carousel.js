import Splide from '@splidejs/splide';

let carousels = document.querySelectorAll('.splide');

carousels.forEach((carousel) => {
  let splide = new Splide(carousel, {
    autoWidth: true,
    focus: 'center',
    drag: true,
    classes: {
      arrows: 'splide__arrows carousel_navigation',
      pagination: 'splide__pagination carousel_pagination',
    }
    });
    splide.mount();
});
