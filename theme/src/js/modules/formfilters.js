import { module } from "modujs";

export default class extends module {
  constructor(m) {
    super(m);
    this.events = {
      change: {
        filters: "queryFilters"
      }
    };
  }

  init() {
    console.log("formfilters");
  }

  queryFilters() {
    console.log("query");
    this.call("destroy", "collapsible", "fraap");
  }
}
