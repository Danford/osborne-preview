// Plan submission. The server enforces the same limit; this just fails sooner.
const MAX_BYTES = 100 * 1024 * 1024;

const form = document.getElementById('send');
const status = document.getElementById('send-status');
const button = form.querySelector('button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const files = [...form.elements.plans.files, ...form.elements.plotPlan.files];
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_BYTES) {
    status.textContent = 'Those files are over the 100 MB limit. Try sending fewer files or a smaller PDF.';
    return;
  }

  button.disabled = true;
  status.textContent = 'Sending your plans...';

  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form) });
    const result = await response.json();
    if (response.ok) {
      form.reset();
      status.textContent = "Thanks, we have your plans. We'll be in touch by email.";
    } else {
      status.textContent = result.error;
    }
  } catch {
    // A dropped connection or a non-JSON reply from something in front of the server.
    status.textContent = 'Your plans did not send. Please try again.';
  } finally {
    button.disabled = false;
  }
});
