import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

export default function defineUnitPlugin() {
    // let config = null;
    let nameToPath = {};
    let pathToCode = {};
    let pathtoFn = {};
    
    // generate a random id
    const uuid = () => Math.floor(Math.random()*1777777771).toString(16);

    // compiles unit file contents
    const compile = (code = "", file = "") => {
        let filePath = null, fileContent = null;

        // remove all import statements while saving the import names & content 
        return code.replace(
            /import (.+?) from "(.+?)"(.+?)/g,
            (_, importName, importPath) => {
                filePath = join(dirname(file), importPath);
                nameToPath[importName] = filePath;
                if (!pathToCode[filePath]) {
                    fileContent = readFileSync(filePath, "utf-8");
                    pathToCode[filePath] = compile(fileContent, filePath);
                    if (!pathtoFn[filePath]) {
                        pathtoFn[filePath] = uuid();
                    }
                }
                return "";
            }
        )
        // replace every html tag matching an import name
        .replace(/<(.+?) ([/]?|.+?)>/g, (match, tag, attr) => {
            if (nameToPath[tag]) {
                return `\${component["$${pathtoFn[nameToPath[tag]]}"]()}`;
            }
            return match;
        }).trim();
    };

    return {
        name: "vite-plugin-unit",
        // configResolved: (c) => config = c,

        /*
         * tranform every unit file imported in a javascript file like main.js
         */
        async transform(source, id) {
            // check if it a ".unit" file
            if (!/\.unit$/.test(id)) return;

            // compile the imported .unit file
            const compiled = compile(source, id);

            // tranform file contents of each unit file into a function
            const fns = Object.keys(pathtoFn).map(k => {
                return `component["$${pathtoFn[k]}"] = () => ${JSON.stringify(pathToCode[k])}`;
            }).join(";");

            // compiled code structure
            const code = `
                export default function() {
                    const component = {};
                    ${fns}
                    return { 
                        setFn: (fn , data) => {
                            console.log(fn, component[fn].toString(), data);
                            component[fn] = new Function(\`return \${data}\`);
                        },
                        html: () => {
                            return \`${compiled}\`
                        }
                    };
                }
            `.trim();

            return { code };
        },

        /* 
         * enable hot reload for unit files
         *
         * TODO: entry files are currently failing 
         */
        async handleHotUpdate(context) {
            // check if it's a unit file
            if (!/\.unit$/.test(context.file)) return;

            // send update to client
            context.server.ws.send({
                type: "custom",
                event: "unit:update",
                data: {
                    file: context.file.replace(context.server.config.root, ""),
                    fn: "$"+pathtoFn[context.file],
                    contents: JSON.stringify(compile(await context.read(), context.file))
                }
            });

            return []; 
        }
    };
}