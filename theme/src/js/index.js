import ResponsiveNav from "./responsive-nav";

const nav = document.getElementById("nav");
const navList = document.getElementById("nav-list");

if (nav && navList) {
  let responsiveNav = new ResponsiveNav(nav, {});
  responsiveNav.init();
}
