export function defineState(Alpine) {
    
    const baseURL = "./"; // import.meta.hot ? "/" : "/unit.js/";

    // https://alpinejs.dev/
    Alpine.data("app", () => ({
        logo: baseURL + "javascript.svg",
        brand: "Unit.js",
        github: "https://github.com/henryhale/unit.js",
        links: [
            { name: "Home", href: baseURL },
            { name: "About", href: baseURL + "about.html" },
            { name: "Example", href: baseURL + "example.html" },
        ]
    }));

};

export function defineTodoAppState(Alpine) {
    
    //https://alpinejs.dev/
    Alpine.data("todo", () => ({
        note: null,
        list: []
    }));
}