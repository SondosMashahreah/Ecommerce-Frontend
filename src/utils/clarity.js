export function initializeClarity() {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim();
  if (!projectId || window.clarity) return;

  window.clarity = window.clarity || function clarity() {
    window.clarity.q = window.clarity.q || [];
    window.clarity.q.push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
}
