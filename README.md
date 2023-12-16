<div align=center>

![](./public/favicon.png)

# unit.js

focus - simplicity - productivity

</div>

## Overview
Unit.js is a lightweight JavaScript UI framework designed to bring focus, simplicity, and enhanced developer productivity to your projects. 
Inspired by [Alpine.js](https://alpinejs.dev) and powered by [Vite](https://vitejs.dev), Unit.js encourages a streamlined development experience with a unique approach to components.

Define state and components once, reuse them wherever.

>Note: ⚠️ This project is still under development.

## Key Features

- [x] **Focus on Simplicity**: Unit.js embraces simplicity as a core principle, making it easy for developers to create and manage UI components effortlessly.

- [x] **File-based Components**: Components in Unit.js are represented as files ending with the `.unit` extension. This convention simplifies organization and encourages a modular structure in your project. You can import `.unit` files into another `.unit` file.

- [x] **Alpine.js Syntax**: Leverage the expressive syntax of Alpine.js within your components. Enjoy the power of declarative programming without unnecessary complexity.

- [ ] **Lightning-fast Development with Vite HMR**: Built on the Vite build tool, Unit.js will ensure rapid development and efficient hot module replacement, allowing you to see changes in real-time as you code.

- [ ] **HTML build output & Server Side Rendering support**: Generate a fully-rendered page at build time (_Alpine.js will be injected_).

## Getting Started

1. **Installation**: Install Unit.js using your preferred package manager.

   ```bash
   npx degit github:henryhale/unit.js my_app
   cd my_app
   npm install
   ```

2. **Create Your First Component**: Within your `src/pages/` folder, simply create a new file with the `.unit` extension, import it into the `src/pages/index.unit` and you're ready to start building your UI component using Alpine.js syntax.

   ```html
   <!-- hello.unit -->
   <div x-data="{ message: 'Hello, Unit.js!' }">
       <p x-text="message"></p>
   </div>
   ```

   ```html
   <!-- index.unit -->
   import Hello from "hello.unit";

   <Hello />
   ```

> NB: Feel free to scrap out stuff that you don't need for example .github/workflow/...

3. **Run the Development Server**: Start the development server to see your changes in real-time.

   ```bash
   npm run dev
   # pnpm dev
   ```

4. **Build for Production** - _WIP_: When you're ready to deploy your application, build for production to optimize and minimize your code.

   ```bash
   npm run build
   # pnpm build
   ```

## Contributing

Contributions are welcome to make Unit.js even better! Feel free to open issues or submit pull requests.

## License

Unit.js is released under the [MIT License](LICENSE).

Copyright &copy; 2023 [Henry Hale](https://github.com/henryhale)

---

Enjoy the focus, simplicity, and increased productivity that Unit.js brings to your JavaScript UI development!
