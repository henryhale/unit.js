import{d as a,m as i,r as l}from"./state-fBv8qDZN.js";function o(){const n={};return n.$6670359b=()=>`<nav x-data="app">
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
</p>`,{setFn:(e,t)=>{console.log(e,n[e].toString(),t),n[e]=new Function(`return ${t}`)},html:()=>`<div>
    ${n.$6670359b()}
    <main>
        <h2>About Unit.js</h2>
        <p>
            Unit.js is a sweet little wrapper around Alpine.js
            to enable you build multi-page applications.
        </p>
    </main>
    ${n.$4693293()}
</div>`}}a(i);l(o,"#app",void 0);
