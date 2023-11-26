import{d as e,m as o,r as l}from"./state-fBv8qDZN.js";function r(){const n={};return n.$6670359b=()=>`<nav x-data="app">
    <a>
        <img :src="logo" :alt="brand" class="logo"/>
    </a>
    <h1 x-text="brand"></h1>
    <ul>
        <template x-for="x in links" x-key="x.link">
            <li>
                <a :href="x.href" x-text="x.name"></a>
            </li>
        </template>
    </ul>
</nav>`,n.$4693293=()=>`<p class="read-the-docs">
    Built with 💛 by 
    <a href="https://github.com/henryhale">Henry Hale</a> 
</p>`,{setFn:(t,a)=>{console.log(t,n[t].toString(),a),n[t]=new Function(`return ${a}`)},html:()=>`<div>
    ${n.$6670359b()}
    <main>
        <div class="card">
            <button x-data="{count: 0}" @click="count++" type="button">
                Count: <span x-text="count"></span>
            </button>
        </div>
    </main>
    ${n.$4693293()}
</div>`}}e(o);l(r,"#app",void 0);
