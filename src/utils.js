export const initializeState = (target, props, componentConstructor) => {
  let component = new componentConstructor({
    target: getTarget(target),
    props,
  });

  return { component };
}


export const getTarget = (target) => {
  if (target instanceof HTMLElement) {
    return target;
  } else if (typeof target === "string") {
    let el = document.getElementById(target);
    if (el) {
      return el;
    } else {
      console.error("Could not find target element for", target);
    }
  } else {
    console.error("Could not find target element for", target);
  }
}