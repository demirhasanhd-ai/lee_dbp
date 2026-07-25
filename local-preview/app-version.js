async function applyAppVersion() {
  try {
    const response = await fetch("/app-version.json", { cache: "no-store" });
    if (!response.ok) return;
    const { version } = await response.json();
    if (!version) return;

    document.querySelectorAll("[data-app-version]").forEach((element) => {
      element.textContent = `Versiyon: ${version}`;
    });
  } catch {
    // The static fallback remains visible when the local dev endpoint is unavailable.
  }
}

applyAppVersion();
