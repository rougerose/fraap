let isScroll = false,
  onScrollTimeout = "",
  onScrollEnd = [];

function subMenuFromTo(shortcut, container) {
  let from = shortcut.closest(".site-nav_list"),
    to = container.querySelector(new URL(shortcut.href).hash);
  return { from: from, to: to };
}

function displaySubMenu(shortcut, from, to) {
  let isBack = from.compareDocumentPosition(to) === 2,
    menuBody = shortcut.closest("div.site-nav_body");

  to.setAttribute("aria-hidden", "false");
  from.scrollIntoView({ inline: "start" });

  menuBody.addEventListener("scroll", onScroll, { passive: true });
  let left = isBack ? 0 : to.offsetLeft;
  menuBody.scrollTo({ left: left, behavior: "smooth" });

  onScrollEnd.push(() => {
    from.setAttribute("aria-hidden", "true");
    to.querySelector("[href]").focus();
  });
}

function onScroll(event) {
  isScroll = true;
  clearTimeout(onScrollTimeout);
  onScrollTimeout = setTimeout(() => {
    event.target.removeEventListener("scroll", onScroll, { passive: true });
    onScrollEnd.map((fn) => {
      fn();
    });
    onScrollEnd = [];
    isScroll = false;
  }, 50);
}

function resetMenu(menu) {
  menu.querySelectorAll("ul.site-nav_list").forEach((list, index) => {
    list.setAttribute("aria-hidden", String(index !== 0));
  });
  menu.scrollLeft = 0;
  onScrollEnd = [];
  isScroll = false;
}

export { subMenuFromTo, displaySubMenu, resetMenu };
