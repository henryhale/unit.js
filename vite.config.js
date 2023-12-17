import { dirname, extname } from "node:path";
import { defineConfig } from "vite";
import { join } from "node:path"
import { existsSync, readFileSync } from "node:fs";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { log } from "node:console";

/**
 * User config
 * 
 * Note: All file paths are absolute to the `src` folder
 */
const unitConfig = {
    pages: "pages/",
    template: {
        file: "template.html",
        slot: "#slot#"
    }
};

/**
 * Unit.js Internals
 */
const unit = {
    ...unitConfig,

    // unit file extension
    ext: ".unit",

    // vite resolved config object
    config: null, 

    // source code folder
    srcDir: "src/",

    // intermediate output folder for unit.js
    outputDir: "./.unit/",

    // regexp to match single html tag
    htmlRegex: /<(.+?) ([/]?|.+?)>/g,

    // mapping file path to thier contents
    pathToCode: new Map(),

    // function that compiles .unit files
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
        .replace(this.htmlRegex, (match, tag, attr = "") => {
            const path = nameToPath.get(tag);
            if (path) {
                if (attr.endsWith("/")) attr = attr.slice(0, -1);
                return this.pathToCode.get(path)?.replace(/<(.+?)>/, m => m.slice(0, -1) + " " + attr + ">");
            }
            return match;
        }).trim();
    }
};

export default defineConfig({
    plugins: [
        {
            /**
             * Unit.js - Server plugin
             */
            name: "vite-plugin-unit-serve",

            /**
             * use this plugin in development mode
             */
            apply: "serve",

            /**
             * partial config
             */
            config() {
                return {
                    root: unit.srcDir
                }
            },

            /**
             * intercept vite server requests and compile .unit files on demand
             */
            configureServer({ middlewares, config }) {
                /**
                 * register a middleware to intercept the server's requests
                 */
                middlewares.use(async (req, res, next) => {
                    /**
                     * function to send compiled .unit file as html 
                     */
                    async function respond(file) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        const contents = await readFile(join(config.root, unit.template.file), { encoding: "utf-8" });
                        const compiled = unit.compile(file, await readFile(file, { encoding: "utf-8" })); 
                        res.end(contents.replace(unit.template.slot, compiled));
                    }

                    // folder containing pages
                    const srcDir = join(config.root, unit.pages);

                    // generate actual file path
                    let filePath = join(srcDir, req.url + (req.url.endsWith("/") ? "index.html" : "")); 

                    // check if the requested html file does not exist
                    if (filePath.endsWith(".html") && !existsSync(filePath)) {
                        filePath = filePath.replace(".html", unit.ext);
                        if (existsSync(filePath)) {
                            // print request to the console
                            log(req.method?.toUpperCase(), req.url, filePath);
                            
                            // send requested file
                            return await respond(filePath);
                        }
                    }

                    // try checking if the requested asset exists in the `src` folder
                    if (filePath.lastIndexOf(".") > -1) {
                        filePath = join(config.root, req.url);
                        if (existsSync(filePath)) {
                            // direct the file path relative to the `src` folder
                            req.url = filePath;
                        }
                    }

                    return next();
                });
            }
        },
        {
            /**
             * Unit.js - Build plugin
             */
            name: "vite-plugin-unit-build",

            /**
             * only apply this plugin on `vite build` command
             */
            apply: "build",

            /**
             * modify vite config in favor of this plugin
             */
            config() {
                return {
                    base: "./",
                    root: unit.outputDir,
                }
            },

            /**
             * function invoked when vite has a final configuration 
             */
            configResolved(config) {
                // save the final resolved vite config
                unit.config = config;
            },

            /**
             * function invoked when the build process begins
             */
            async buildStart(options) {
                const outputDir = join(__dirname, unit.outputDir);
                /**
                 * Create unit.js compiled output directory
                 */
                if (existsSync(outputDir)) {
                    await rm(outputDir, { recursive: true, force: true });
                }
                await mkdir(unit.outputDir);

                /**
                 * Copy entire `src/` to `.unit/` 
                 */
                await cp("./src/", unit.outputDir, { recursive: true,  });

                /**
                 * Grab the template file
                 */
                const templateFile = join(unit.outputDir, unit.template.file);
                const template = await readFile(templateFile, { encoding: "utf-8" });

                /**
                 * Capture the pages
                 */
                const srcDir = join(unit.outputDir, "./pages/");
                const srcFiles = await readdir(srcDir, { recursive: true });
                const pages = srcFiles.filter((file) => extname(file) === unit.ext);
                log("pages: ", pages);

                /**
                 * Function that generate .html file from compiled .unit file
                 */
                async function generateBuild(page) {
                    const filePath = join(srcDir, page);
                    options.input.push(join(unit.outputDir, page.replace(unit.ext, ".html")));
                    const fileContent = await readFile(filePath, { encoding: "utf-8" });
                    const compiledPage = unit.compile(filePath, fileContent);
                    const result = template.replace(unit.template.slot, compiledPage);
                    log("build: ", page);
                    return await writeFile(join(outputDir, page.replace(unit.ext, ".html")), result);
                }

                /**
                 * Clear the input files
                 */
                options.input.splice(0, -1);

                /**
                 * Generate builds, add input files for rollup to resolve dependencies 
                 */
                return await Promise.all(pages.map(page => generateBuild(page)));
            },

            /**
             * function invoked when the output bundle is complete
             */
            async closeBundle() {
                /**
                 * Remove the dist folder if exists
                 */
                const distFolder =  join(__dirname, "dist");
                if (existsSync(distFolder)) {
                    await rm(distFolder, { recursive: true, force: true });
                }

                /**
                 * Copy the entire unit dist folder to the root of the project
                 */
                await cp(unit.outputDir + "dist", distFolder, { recursive: true });
                
                // await new Promise((res) => setTimeout(res, 5000));

                /**
                 * Delete the entire unit output folder
                 */
                await rm(unit.outputDir, { recursive: true, force: true });
            } 
        }
    ],
});