export function bindAsyncAction({ button, status, run, messages }) {
  let active = true;
  let pending = false;
  let previousDisabled;

  function render(state) {
    button.dataset.actionState = state;
    status.textContent = messages[state];
  }

  function restoreDisabled() {
    if (previousDisabled === null) button.removeAttribute('aria-disabled');
    else button.setAttribute('aria-disabled', previousDisabled);
  }

  async function activate() {
    if (pending || button.disabled || button.getAttribute('aria-disabled') === 'true') return;

    pending = true;
    previousDisabled = button.getAttribute('aria-disabled');
    button.setAttribute('aria-disabled', 'true');
    render('pending');

    try {
      await run();
    } catch {
      if (active) render('error');
      return;
    } finally {
      pending = false;
      if (active) restoreDisabled();
    }

    if (active) render('success');
  }

  button.addEventListener('click', activate);
  return () => {
    active = false;
    button.removeEventListener('click', activate);
    if (pending) restoreDisabled();
    delete button.dataset.actionState;
  };
}
