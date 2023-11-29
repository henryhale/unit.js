export function render(component, root) {
    root = root instanceof HTMLElement ? root : document.querySelector(root);

    const app = component();

    root.innerHTML = app.html();
    console.log(app.html());
    
    if (import.meta.hot) {
        import.meta.hot.on("unit:update", ({ fn, contents, file }) => {
            console.log("[vite] hot updated: ", file);
            app._setFn(fn, contents);
            root.innerHTML = app.html();
        });
    }
}
