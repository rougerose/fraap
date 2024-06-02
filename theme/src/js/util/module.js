import { toCamel } from "./string";

function getModuleNames(el) {
  const moduleNames = {
    moduleName: "",
    dataName: "",
    typeName: "",
  };
  Array.from(el.attributes).forEach((i) => {
    if (i.name.startsWith("data-module")) {
      let dataName = i.name.split("-").splice(2);
      let moduleName = toCamel(dataName);
      moduleNames.moduleName = moduleName;
      moduleNames.dataName = dataName.join("-");
    }
    if (moduleNames.dataName !== "") {
      if (i.name === "data-" + moduleNames.dataName + "-type") {
        moduleNames.typeName = i.value;
      }
    }
  });
  return moduleNames;
}

function addActiveModule(name, id, module, activeModules) {
  if (activeModules[name]) {
    Object.assign(activeModules[name], { [id]: module });
  } else {
    activeModules[name] = { [id]: module };
  }

  return activeModules;
}

export { getModuleNames, addActiveModule };
