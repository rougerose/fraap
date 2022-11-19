import MenuSpy from "menuspy";

let tocNode = document.querySelectorAll('.toc[data-type="side"]');

if (tocNode.length > 0) {
  tocNode.forEach((toc) => {
    let tocSpy = new MenuSpy(toc, {
      threshold: 16,
      activeClass: "is-active",
      enableLocationHash: false,
    });
  });
}
