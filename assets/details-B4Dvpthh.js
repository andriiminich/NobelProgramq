import{q as H,i as q,f as D,e as t,a as n,b as z,c as E,g as M,d as N,t as S,h as T}from"./theme-Cr2asbhu.js";const p=H("#laureate-detail");function x(a){const i=n(a.motivation),e=(a.affiliations??[]).map(r=>n(r.name)||n(r.nameNow)).filter(Boolean).join(", "),s=T(a.prizeAmount);return`
    <article class="prize">
      <header class="prize__header">
        <span class="prize__year">${t(a.awardYear)}</span>
        <div>
          <h3 class="prize__category">${t(n(a.categoryFullName)||n(a.category))}</h3>
          ${a.portion?`<p class="prize__portion">Частка премії: ${t(a.portion)}</p>`:""}
        </div>
      </header>
      ${i?`<blockquote class="prize__motivation">«${t(i)}»</blockquote>`:""}
      ${e?`<p class="prize__affiliations"><strong>Організація:</strong> ${t(e)}</p>`:""}
      ${a.prizeAmount!=null?`<p class="prize__amount"><strong>Сума премії:</strong> ${t(s)}</p>`:""}
    </article>
  `}function L(a,i){var h,f,m,_,g,$,v,b,w;const e=n(a.knownName)||n(a.fullName)||"Без імені",s=z((h=a.birth)==null?void 0:h.date),r=z((f=a.death)==null?void 0:f.date),o=n((_=(m=a.birth)==null?void 0:m.place)==null?void 0:_.locationString),u=n(($=(g=a.death)==null?void 0:g.place)==null?void 0:$.locationString),l=(v=a.wikipedia)==null?void 0:v.english,c=(w=(b=a.links)==null?void 0:b.find(k=>{var y;return k.rel==="external"&&((y=k.class)==null?void 0:y.includes("laureate facts"))}))==null?void 0:w.href,P=(a.nobelPrizes??[]).map(x).join(""),A=i?`<img class="laureate__avatar-img" src="${t(i)}" alt="" onerror="this.remove()" />`:"";document.title=`${e} — Нобелівські лауреати`,p.innerHTML=`
    <article class="laureate">
      <div class="laureate__hero">
        <span class="laureate__avatar" aria-hidden="true">${t(E(e))}${A}</span>
        <div class="laureate__heading">
          <h1 class="laureate__name">${t(e)}</h1>
          <dl class="laureate__facts">
            <div class="fact">
              <dt>Стать</dt>
              <dd>${t(M(a.gender))}</dd>
            </div>
            <div class="fact">
              <dt>Народження</dt>
              <dd>${t(s)}${o?`, ${t(o)}`:""}</dd>
            </div>
            ${a.death?`<div class="fact">
              <dt>Смерть</dt>
              <dd>${t(r)}${u?`, ${t(u)}`:""}</dd>
            </div>`:""}
          </dl>
        </div>
      </div>

      <section class="laureate__section" aria-labelledby="prizes-title">
        <h2 id="prizes-title">Нобелівські премії</h2>
        <div class="prize-list">${P||"<p>Інформація про премії відсутня.</p>"}</div>
      </section>

      ${l||c?`<section class="laureate__section" aria-labelledby="links-title">
        <h2 id="links-title">Додаткові джерела</h2>
        <ul class="link-list">
          ${l?`<li><a href="${t(l)}" target="_blank" rel="noopener noreferrer">Wikipedia (англ.)</a></li>`:""}
          ${c?`<li><a href="${t(c)}" target="_blank" rel="noopener noreferrer">Сторінка на nobelprize.org</a></li>`:""}
        </ul>
      </section>`:""}
    </article>
  `}function F(){p.innerHTML=`<div class="status status--loading" role="status">
    <span class="spinner" aria-hidden="true"></span>
    <span>Завантаження даних…</span>
  </div>`}function d(a){p.innerHTML=`<div class="status status--error" role="alert">
    <strong>Не вдалося завантажити інформацію.</strong>
    <p>${t(a)}</p>
    <a class="button" href="index.html">Повернутися до каталогу</a>
  </div>`}async function j(a,i){var s;const e=(s=a.wikipedia)==null?void 0:s.slug;if(e)try{const r=await N([e],i);if(i.aborted)return;const o=r.get(S(e));o&&L(a,o)}catch{}}async function B(){q();const a=new URLSearchParams(window.location.search).get("id");if(!a){d("Не вказано ідентифікатор лауреата.");return}F();const i=new AbortController;try{const s=(await D(a,i.signal))[0];if(!s){d(`Лауреата з ідентифікатором «${a}» не знайдено.`);return}L(s),await j(s,i.signal)}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;d(e instanceof Error?e.message:"Невідома помилка.")}}B();
