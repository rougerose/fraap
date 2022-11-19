import { subMenuFromTo, displaySubMenu, resetMenu } from "./util/subMenu";

function mainMenuInit() {
  let menuShortcuts = document.querySelector("#navShortcuts"),
    menuOffcanvas = document.querySelector("#siteNavOffcanvas"),
    menuOffcanvasDocument = menuOffcanvas.querySelector('[role="document"]'),
    menuShortcutsList, offcanvasShortcutsList;

  if (menuShortcuts && menuOffcanvas) {
    menuShortcutsList = menuShortcuts.querySelectorAll('li[data-type-link="shortcut"]');
    offcanvasShortcutsList = menuOffcanvas.querySelectorAll('li[data-type-link="shortcut"] > [href][data-menu-controls]');

    offcanvasShortcutsList.forEach((shortcut) => {
      let submenuPath = subMenuFromTo(shortcut, menuOffcanvas);

      shortcut.addEventListener("click", (event) => {
        event.preventDefault();
        displaySubMenu(shortcut, submenuPath.from, submenuPath.to);
      });
    });

    resetMenu(menuOffcanvas);

    menuShortcutsList.forEach((shortcut) => {
      let link = shortcut.getElementsByTagName("a")[0];
      convertLinkToButton(shortcut, link);
    })
  }
}

function convertLinkToButton(element, link) {
  let linkHTML = link.innerHTML,
    linkAttr = link.attributes,
    button = document.createElement("button");

  if (null !== link) {
    button.innerHTML = linkHTML.trim();

    for (let index = 0; index < linkAttr.length; index++) {
      const attribute = linkAttr[index];
      if ("href" !== attribute.name) {
        button.setAttribute(attribute.name, attribute.value);
        button.setAttribute("type", "button");
        button.setAttribute("data-a11y-dialog-show", "siteNavOffcanvas");
      }
    }
    element.replaceChild(button, link);
  }
  // return button;
}

const fraapMenu = { init: mainMenuInit };

export default fraapMenu;
