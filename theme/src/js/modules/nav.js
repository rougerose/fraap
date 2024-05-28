import { module } from "modujs";
import { doc } from "../util/environment";
// import { subMenuFromTo, displaySubMenu, resetMenu } from "../util/subMenu";


// Navigation (site-header)
export default class extends module {
  constructor(m) {
    super(m);
    // Récupérer les raccourcis data-nav="shortcut"
    this.shortcuts = this.el.querySelectorAll('li[data-type-link="shortcut"');
  }
  init() {
    // Transformer chaque lien en bouton
    // qui ouvrira la modale contenant la navigation principale
    this.shortcuts.forEach((shortcut) => {
      let link = shortcut.children[0];

      if (link) {
        let linkHTML = link.innerHTML,
          linkAttr = link.attributes,
          button = doc.createElement("button");

        button.innerHTML = linkHTML.trim();
        for (let i = 0; i < linkAttr.length; i++) {
          const attribute = linkAttr[i];
          if ("href" !== attribute.name) {
            button.setAttribute(attribute.name, attribute.value);
            button.setAttribute("type", "button");
            button.setAttribute("data-a11y-dialog-show", "siteNavOffcanvas");
            button.setAttribute("data-nav", "button");
          }
        }
        shortcut.replaceChild(button, link);
      }
    });
  }
}
