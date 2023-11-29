import{d as l,m as n,r}from"./state-PWq3DCPy.js";function i(){const a={};return a.$42110b8f=(e="")=>`<li>
    <a :href="href" x-text="name"></a>
</li>`.replace(/<(.+?)>/,t=>t.slice(0,-1)+" "+e+">"),a.$304adaf9=(e="")=>`<nav x-data="app">
    <a>
        <img :src="logo" :alt="brand" class="logo"/>
    </a>
    <h1 x-text="brand"></h1>
    <ul>
        <template x-for="x in links" x-key="x.link">
            ${a.$42110b8f('x-data="x" /')}
        </template>
    </ul>
</nav>`.replace(/<(.+?)>/,t=>t.slice(0,-1)+" "+e+">"),a.$2b89d164=(e="")=>`<p class="read-the-docs">
    Built with 💛 by 
    <a href="https://github.com/henryhale">Henry Hale</a> 
</p>`.replace(/<(.+?)>/,t=>t.slice(0,-1)+" "+e+">"),{_setFn:(e,t)=>{console.log(e,a[e].toString(),t),a[e]=new Function(`return ${t}`)},html:()=>`<div>
    ${a.$304adaf9("/")}
    <main>
        <h2>About Unit.js</h2>
        <p>
            Unit.js is a sweet little wrapper around Alpine.js
            to enable you build multi-page applications.
        </p>
    </main>
    ${a.$2b89d164("/")}
</div>`}}l(n);r(i,"#app");
