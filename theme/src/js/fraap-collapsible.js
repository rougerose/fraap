

/**
 * Collapsible (accordion)
 * Source https://inclusive-components.design/collapsible-sections/
 * @param {bool} trackHeadings - Reporter dans un champ hidden l'identifiant du bouton ouvert. Utile lors l'accordéon est utilisé dans un formulaire.
 */
const collapsibleInit = (container, trackHeadings) => {
  const track = trackHeadings || false;
  const headings = container.querySelectorAll(".collapsible_heading");

  if (headings.length > 0) {
    Array.prototype.forEach.call(headings, (heading) => {
      let btn = heading.firstElementChild;
      let target = heading.nextElementSibling;

      btn.onclick = () => {
        let expanded = btn.getAttribute("aria-expanded") === "true" || false;
        btn.setAttribute("aria-expanded", !expanded);
        target.hidden = expanded;

        if (track) {
          let hidden = btn.nextElementSibling;
          if (!expanded) {
            hidden.setAttribute("value", btn.id);
          } else {
            hidden.setAttribute("value", "");
          }
        }
      };
    });
  }
}

const fraapCollapsible = {
  init: collapsibleInit,
};

export default fraapCollapsible;
