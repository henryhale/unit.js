export function render(component, root, dev = true) {
    root = root instanceof HTMLElement ? root : document.querySelector(root);

    const app = component();

    root.innerHTML = app.html();
    
    if (dev) {
        if (import.meta.hot) {
            import.meta.hot.on("unit:update", ({ fn, contents, file }) => {
                console.log("[vite] hot updated: ", file);
                app.setFn(fn, contents);
                root.innerHTML = app.html();
            });
        }
    }
}
