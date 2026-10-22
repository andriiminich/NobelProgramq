import{a as T,e as u,c as A,q as i,i as C,C as P,j as x,d as j,t as Y}from"./theme-Cr2asbhu.js";function O(e){return[...new Set((e.nobelPrizes??[]).map(n=>T(n.category)).filter(Boolean))]}function z(e){return[...new Set((e.nobelPrizes??[]).map(n=>n.awardYear).filter(Boolean))]}function F(e,n){var l,b;const t=T(e.knownName)||T(e.fullName)||"Без імені",a=((l=e.birth)==null?void 0:l.year)??"",o=((b=e.death)==null?void 0:b.year)??"",s=a||o?`${a}–${o}`:"",c=O(e).map(v=>`<span class="chip">${u(v)}</span>`).join(""),p=z(e).join(", "),$=n?`<img class="card__avatar-img" src="${u(n)}" alt="" loading="lazy" onerror="this.remove()" />`:"";return`
    <li class="card">
      <a class="card__link" href="details.html?id=${encodeURIComponent(e.id)}">
        <span class="card__avatar" aria-hidden="true">${u(A(t))}${$}</span>
        <span class="card__body">
          <span class="card__name">${u(t)}</span>
          <span class="card__meta">${u(p)}${s?` · ${u(s)}`:""}</span>
          <span class="card__chips">${c}</span>
        </span>
        <span class="card__cta">Детальніше<span class="visually-hidden"> про ${u(t)}</span> →</span>
      </a>
    </li>
  `}function B(e,n){if(e<=7)return Array.from({length:e},(s,c)=>c+1);const t=[1],a=Math.max(2,n-1),o=Math.min(e-1,n+1);a>2&&t.push("ellipsis");for(let s=a;s<=o;s+=1)t.push(s);return o<e-1&&t.push("ellipsis"),t.push(e),t}function D(e){const{offset:n,limit:t,total:a}=e;if(a<=t)return"";const o=Math.ceil(a/t),s=Math.floor(n/t)+1,c=B(o,s).map(l=>{if(l==="ellipsis")return'<span class="pagination__ellipsis" aria-hidden="true">…</span>';const b=(l-1)*t,v=l===s;return`<button type="button" class="pagination__page${v?" is-current":""}" data-offset="${b}" aria-label="Сторінка ${l}"${v?' aria-current="page"':""}>${l}</button>`}).join(""),p=n<=0,$=n+t>=a;return`
    <button type="button" class="pagination__nav" data-offset="${Math.max(0,n-t)}"${p?' disabled aria-disabled="true"':""} aria-label="Попередня сторінка">←</button>
    <div class="pagination__pages">${c}</div>
    <button type="button" class="pagination__nav" data-offset="${n+t}"${$?' disabled aria-disabled="true"':""} aria-label="Наступна сторінка">→</button>
  `}function V(){return`
    <li class="card card--skeleton" aria-hidden="true">
      <span class="skeleton skeleton--avatar"></span>
      <span class="skeleton skeleton--line skeleton--line--wide"></span>
      <span class="skeleton skeleton--line skeleton--line--short"></span>
      <span class="skeleton__chips">
        <span class="skeleton skeleton--chip"></span>
        <span class="skeleton skeleton--chip"></span>
      </span>
    </li>
  `}function N(e,n){switch(e){case"loading":return`<div class="status status--loading" role="status">
        <span class="spinner" aria-hidden="true"></span>
        <span>Завантаження даних…</span>
      </div>`;case"error":return`<div class="status status--error" role="alert">
        <strong>Сталася помилка.</strong>
        <p>${u(n??"Не вдалося завантажити дані.")}</p>
        <button type="button" class="button" data-retry>Спробувати ще раз</button>
      </div>`;case"empty":return`<div class="status status--empty" role="status">
        <p>За вашим запитом нічого не знайдено. Спробуйте змінити умови пошуку або фільтри.</p>
      </div>`}}function w(e){const n=(e.nobelPrizes??[]).map(t=>Number(t.awardYear)).filter(t=>Number.isFinite(t));return n.length===0?Number.POSITIVE_INFINITY:Math.min(...n)}function q(e,n){return[...e].sort((t,a)=>{const o=w(t),s=w(a),c=o===Number.POSITIVE_INFINITY,p=s===Number.POSITIVE_INFINITY;return c&&p?0:c?1:p?-1:n==="desc"?s-o:o-s})}const R=12,r={search:"",category:"",gender:"",sort:"desc",offset:0,limit:R,total:0};let f=null,h=!1;const k=i("#search-input"),I=i("#category-select"),E=i("#gender-select"),M=i("#sort-select"),_=i("#laureate-list"),m=i("#status"),d=i("#pagination"),L=i("#result-count"),U=i("#filters");function G(){const e=P.map(n=>`<option value="${n.code}">${n.label}</option>`).join("");I.insertAdjacentHTML("beforeend",e)}function Q(){return{search:r.search,category:r.category,gender:r.gender,offset:r.offset,limit:r.limit}}function J(){_.innerHTML=Array.from({length:6},()=>V()).join(""),m.innerHTML='<span class="visually-hidden">Завантаження даних…</span>',d.innerHTML="",L.textContent=""}function K(e){h=!1,_.innerHTML="",m.innerHTML=N("error",e),d.innerHTML="",L.textContent=""}function W(){h=!1,_.innerHTML="",m.innerHTML=N("empty"),d.innerHTML="",L.textContent="Знайдено: 0"}function S(e,n){_.innerHTML=e.map(t=>{var s;const a=(s=t.wikipedia)==null?void 0:s.slug,o=a?n.get(Y(a)):void 0;return F(t,o)}).join("")}function X(e,n){var t;m.innerHTML="",S(e,new Map),L.textContent=`Знайдено: ${n}`,d.innerHTML=D({offset:r.offset,limit:r.limit,total:n}),h&&(h=!1,(t=d.querySelector(".pagination__page.is-current"))==null||t.focus())}async function Z(e,n){const t=e.map(a=>{var o;return(o=a.wikipedia)==null?void 0:o.slug}).filter(a=>!!a);if(t.length!==0)try{const a=await j(t,n);if(n.aborted)return;a.size>0&&S(e,a)}catch{}}async function y(){var n;f==null||f.abort(),f=new AbortController;const e=f.signal;J();try{const t=await x(Q(),e);if(r.total=((n=t.meta)==null?void 0:n.count)??t.laureates.length,t.laureates.length===0){W();return}const a=q(t.laureates,r.sort);X(a,r.total),await Z(a,e)}catch(t){if(t instanceof DOMException&&t.name==="AbortError")return;const a=t instanceof Error?t.message:"Невідома помилка.";K(a)}}function g(){r.offset=0,y()}let H;function tt(){window.clearTimeout(H),H=window.setTimeout(()=>{r.search=k.value,g()},350)}function et(){C(),G(),k.addEventListener("input",tt),I.addEventListener("change",()=>{r.category=I.value,g()}),E.addEventListener("change",()=>{r.gender=E.value,g()}),M.addEventListener("change",()=>{r.sort=M.value,g()}),U.addEventListener("submit",e=>{e.preventDefault(),r.search=k.value,g()}),m.addEventListener("click",e=>{e.target.closest("[data-retry]")&&y()}),d.addEventListener("click",e=>{const t=e.target.closest("[data-offset]");!t||t.disabled||(r.offset=Number(t.dataset.offset),h=!0,y(),d.scrollIntoView({behavior:"smooth",block:"nearest"}))}),y()}et();
