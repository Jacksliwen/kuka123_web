<template>
  <a :href="site.url" target="_blank" rel="noopener noreferrer"
    class="card" :style="{'--j': idx ?? 0}">

    <!-- 左侧选中竖条 -->
    <span class="card-accent" aria-hidden="true"></span>

    <div class="card-ico">
      <img v-if="!err" :src="faviconUrl" :alt="site.name" @error="onErr"
        class="fav-img" loading="lazy"/>
      <span v-else class="fav-fb">{{ site.name.charAt(0).toUpperCase() }}</span>
    </div>

    <div class="card-body">
      <div class="card-meta">
        <span class="card-name">{{ site.name }}</span>
        <span class="card-url">{{ domain }}</span>
      </div>
      <p class="card-desc">{{ site.desc || '暂无描述' }}</p>
    </div>

    <!-- 右上角外链箭头，hover 时出现 -->
    <svg class="card-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  </a>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ site: Object, idx: Number })
const errCount = ref(0)

const domain = computed(() => {
  try { return new URL(props.site.url).hostname.replace(/^www\./, '') }
  catch { return props.site.url }
})

const faviconUrl = computed(() => {
  const n = errCount.value
  if (n === 0 && props.site.favicon)
    return props.site.favicon
  if (n === 0 || n === 1)
    return `https://icons.duckduckgo.com/ip3/${domain.value}.ico`
  if (n === 2) {
    try { return `${new URL(props.site.url).origin}/favicon.ico` }
    catch { return '' }
  }
  return ''
})

const err = computed(() => errCount.value >= 3)
function onErr() { errCount.value++ }
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: clamp(7px, .9vw, 11px);
  padding: clamp(9px, 1.1vw, 13px);
  padding-left: calc(clamp(9px, 1.1vw, 13px) + 3px); /* 为竖条留空 */
  border-radius: clamp(8px, .8vw, 12px);
  background: var(--card-bg);
  border: 1px solid var(--card-bd);
  text-decoration: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    transform .2s cubic-bezier(.25,.46,.45,.94),
    box-shadow .2s ease,
    border-color .2s ease,
    background .2s ease;
  animation: cIn .22s ease calc(var(--j, 0) * .015s) both;
}
@keyframes cIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* hover：上移 + 阴影 + 背景微亮 */
.card:hover {
  transform: translateY(-5px);
  border-color: var(--acc2);
  background: var(--card-hov-bg, #f8fbff);
  box-shadow:
    0 8px 24px rgba(37,99,235,.12),
    0 2px 8px rgba(0,0,0,.06);
}
.night .card:hover {
  background: #0f2040;
  box-shadow:
    0 8px 24px rgba(96,165,250,.2),
    0 2px 8px rgba(0,0,0,.3);
}

/* 左侧竖条：平时透明，hover 时从上往下展开 */
.card-accent {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(180deg, var(--acc), var(--acc2));
  transform: scaleY(0);
  transform-origin: top;
  transition: transform .2s cubic-bezier(.25,.46,.45,.94);
}
.card:hover .card-accent { transform: scaleY(1); }

/* 图标：hover 时轻微放大 */
.card-ico {
  width: clamp(34px, 3.8vw, 50px);
  height: clamp(34px, 3.8vw, 50px);
  border-radius: clamp(7px, .7vw, 10px);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--ico-bg);
  transition: transform .2s cubic-bezier(.25,.46,.45,.94);
}
.card:hover .card-ico { transform: scale(1.08); }

.fav-img { width:100%; height:100%; object-fit:contain; display:block; }

.fav-fb {
  width:100%; height:100%;
  display:flex; align-items:center; justify-content:center;
  font-size: clamp(.9rem, 1.1vw, 1.2rem);
  font-weight:800; color:var(--acc); line-height:1;
}

.card-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:clamp(2px,.3vw,4px); }
.card-meta { display:flex; flex-direction:column; gap:2px; min-width:0; }

.card-name {
  font-size: clamp(.74rem,.92vw,.86rem);
  font-weight:700; color:var(--text);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  line-height:1.3;
  transition: color .15s;
}
.card:hover .card-name { color: var(--acc); }

.card-url {
  display:inline-block; align-self:flex-start;
  font-size: clamp(.55rem,.7vw,.62rem);
  color:var(--acc2); background:var(--url-bg);
  border-radius:3px; padding:1px 5px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;
  font-family:'SF Mono','Consolas','Monaco',monospace;
  letter-spacing:-.01em; line-height:1.5;
  transition: background .15s, color .15s;
}
.card:hover .card-url { background:var(--url-bg-hov); color:var(--acc); }

.card-desc {
  font-size: clamp(.63rem,.8vw,.7rem);
  color:var(--text3); line-height:1.45;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
  overflow:hidden; margin:0; min-height:2em;
  transition: color .15s;
}
.card:hover .card-desc { color:var(--text2); }

/* 右上角外链箭头 */
.card-arrow {
  position: absolute;
  top: 8px; right: 9px;
  color: var(--acc2);
  opacity: 0;
  transform: translate(2px, -2px);
  transition: opacity .18s ease, transform .18s ease;
}
.card:hover .card-arrow { opacity: .7; transform: translate(0,0); }

@media (max-width: 480px) {
  .card-desc { display:none; }
  .card-url  { display:none; }
  .card { padding:8px; gap:7px; }
  .card-name { font-size:.78rem; }
  .card-arrow { display:none; }
}
</style>
