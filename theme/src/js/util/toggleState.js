const toggleState = (state, newStatus) => {
  if (newStatus) {
    if (state.status === newStatus) {
      return;
    }
    state.status = newStatus;
  } else {
    state.status = state.status === "closed" ? "open" : "closed";
  }
};

export default toggleState;
