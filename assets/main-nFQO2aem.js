import{d as n,m as r,r as l}from"./state-PWq3DCPy.js";function o(){const e={};return e.$42110b8f=(t="")=>`<li>
    <a :href="href" x-text="name"></a>
</li>`.replace(/<(.+?)>/,a=>a.slice(0,-1)+" "+t+">"),e.$304adaf9=(t="")=>`<nav x-data="app">
    <a>
        <img :src="logo" :alt="brand" class="logo"/>
    </a>
    <h1 x-text="brand"></h1>
    <ul>
        <template x-for="x in links" x-key="x.link">
            ${e.$42110b8f('x-data="x" /')}
        </template>
    </ul>
</nav>`.replace(/<(.+?)>/,a=>a.slice(0,-1)+" "+t+">"),e.$2b89d164=(t="")=>`<p class="read-the-docs">
    Built with 💛 by 
    <a href="https://github.com/henryhale">Henry Hale</a> 
</p>`.replace(/<(.+?)>/,a=>a.slice(0,-1)+" "+t+">"),{_setFn:(t,a)=>{console.log(t,e[t].toString(),a),e[t]=new Function(`return ${a}`)},html:()=>`<div>
    ${e.$304adaf9("/")}
    <main>
        <div class="card">
            <button x-data="{count: 0}" @click="count++" type="button">
                Count: <span x-text="count"></span>
            </button>
        </div>
    </main>
    ${e.$2b89d164("/")}
</div>`}}n(r);l(o,"#app");
