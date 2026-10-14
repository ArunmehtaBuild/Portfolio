// Back on the home page: the slot matches this and renders nothing, which closes the panel.
// (Parallel-route slots keep their last state on client navigation unless something matches.)
export default function NoPanel() {
  return null;
}
