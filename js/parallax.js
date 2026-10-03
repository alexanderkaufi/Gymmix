(() => {
  const layers = Array.from(document.querySelectorAll("[data-parallax]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!layers.length || reducedMotion.matches) return;

  const distanceScale = window.matchMedia("(pointer: coarse)").matches ? 0.58 : 1;
  let frameRequested = false;

  const updateLayers = () => {
    frameRequested = false;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const updates = layers.map((layer) => {
      const bounds = layer.getBoundingClientRect();
      const distance = (bounds.top + bounds.height / 2 - viewportHeight / 2) / viewportHeight;
      const speed = Number(layer.dataset.parallax) || 0;
      return [layer, (-distance * speed * distanceScale).toFixed(1) + "px"];
    });

    updates.forEach(([layer, offset]) => layer.style.setProperty("--parallax-y", offset));
  };

  const scheduleUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateLayers);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  scheduleUpdate();
})();
