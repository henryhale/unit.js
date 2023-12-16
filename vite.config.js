import { dirname } from "node:path";
import { defineConfig } from "vite";
import { join } from "node:path"
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { log } from "node:console";

const unitConfig = {
    template: {
        file: "src/template.html",
        slot: "#slot#"
    },
    compiler: {
        ext: ".unit",
        handler: (file, code) => {
            return unitInternals.compile(file, code);
        }
    }
};

const unitInternals = {
    // regexp to match single html tag
    htmlRegex: /<(.+?) ([/]?|.+?)>/g,

    pathToCode: new Map(),

    compile(file = "", code = "") {
        let filePath = null;
        let content = null;
        const nameToPath = new Map();

        // remove all import statements while saving the import names & content 
        return code.replace(
            /import (.+?) from "(.+?)"(.+?)/g,
            (_, importName, importPath) => {
                filePath = join(dirname(file), importPath);
                nameToPath.set(importName, filePath);
                if (!this.pathToCode.has(filePath)) {
                    content = this.compile(filePath, readFileSync(filePath, "utf-8"));
                    this.pathToCode.set(filePath, content);
                }
                return "";
            }
        )
        // replace every html tag matching an import name
        .replace(this.htmlRegex, (match, tag, attr) => {
            const path = nameToPath.get(tag);
            if (path) {
                return this.pathToCode.get(path)?.replace(/<(.+?)>/, m => m.slice(0, -1) + " " + attr + ">");
            }
            return match;
        }).trim();
    }
};

export default defineConfig({
    plugins: [
        {
            name: "vite-plugin-unit-serve",
            apply: "serve",
            configureServer({ middlewares, config }) {
                middlewares.use(async (req, res, next) => {
                    async function respond(file) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        const contents = await readFile(join(config.root, unitConfig.template.file), { encoding: "utf-8" });
                        const compiled = unitConfig.compiler.handler(file, await readFile(file, { encoding: "utf-8" })); 
                        res.end(contents.replace(unitConfig.template.slot, compiled));
                    }
                    const srcDir = join(config.root, "src/pages/");
                    let filePath = join(srcDir, req.url + (req.url.endsWith("/") ? "index.html" : "")); 
                    log(req.method?.toUpperCase(), req.url, filePath);
                    if (!filePath.endsWith(".html")) {
                        if (filePath.lastIndexOf(".") > -1) {
                            filePath = join(config.root, "src/" + req.url);
                            if (existsSync(filePath)) {
                                req.url = filePath;
                            }
                            return next();
                        } else {
                            filePath = join(srcDir, req.url + unitConfig.compiler.ext);
                            log("file check: ", filePath);
                            if (existsSync(filePath)) {
                                return await respond(filePath);
                            }
                            filePath = join(srcDir, req.url, "/index" + unitConfig.compiler.ext);
                            log("dir check: ", filePath);
                            if (existsSync(filePath)) {
                                return await respond(filePath);
                            }
                        }
                        return next();
                    }
                    if (!existsSync(filePath)) {
                        filePath = filePath.replace(".html", unitConfig.compiler.ext);
                        if (existsSync(filePath)) {
                            return await respond(filePath);
                        }
                    }
                    next();
                });
            }
        },
        {
            name: "vite-plugin-unit-build",
            apply: "build",
            /**
             * work in progress
             */
        }
    ]
});