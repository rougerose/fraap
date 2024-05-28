// Menu principal (offcanvas)
import { module } from "modujs";
import { subMenuFromTo, displaySubMenu, resetMenu } from "../util/subMenu";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    this.shortcuts = this.el.querySelectorAll('li[data-type-link="shortcut"] > [href][data-menu-controls]');

    this.shortcuts.forEach(shortcut => {
      let submenuPath = subMenuFromTo(shortcut, this.el);

      shortcut.addEventListener("click", (event) => {
        event.preventDefault();
        displaySubMenu(shortcut, submenuPath.from, submenuPath.to);
      });
    });

    resetMenu(this.el);
  }

}
