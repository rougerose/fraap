import ClickyMenus from "./clicky-menus";
import ResponsiveNav from "./responsive-nav";

/**
 *
 */
const nav = document.getElementById("nav");
const navList = document.getElementById("nav-list");

if (nav) {
  let responsiveNav = new ResponsiveNav(nav, {});
  responsiveNav.init();

  // const navToggle = nav.querySelector("#nav-toggle");
  // let isNavExpanded = navToggle.getAttribute("aria-expanded") === "true";

  // navToggle.removeAttribute("hidden");
  // navToggle.setAttribute("data-state", "visible");

  // const toggleNavVisibility = () => {
  //   isNavExpanded = !isNavExpanded;
  //   navToggle.setAttribute("aria-expanded", isNavExpanded);
  // };

  // navToggle.addEventListener("click", toggleNavVisibility);
}

/**
 * ClickyMenus
 */
if (navList) {
  let clickyMenu = new ClickyMenus(navList, {submenuSelector: ".c-nav_section"});
  clickyMenu.init();
}
