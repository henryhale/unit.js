export default function defineState(Alpine) {
    
    const baseURL = import.meta.hot ? "/" : "/unit.js/";

    Alpine.data("app", () => ({
        logo: baseURL + "javascript.svg",
        brand: "Unit.js",
        links: [
            { name: "Home", href: baseURL },
            { name: "About", href: baseURL + "about/" }
        ]
    }));

    window.onload = () => Alpine.start();
};