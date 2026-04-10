<template>
  <div class="layout" :class="isDay ? 'day' : 'night'">

    <aside class="sb" :class="{mini: sbCollapsed}">
      <div class="sb-logo">
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
          <defs><linearGradient id="slg" x1="0" y1="0" x2="40" y2="40">
            <stop stop-color="#60a5fa"/><stop offset="1" stop-color="#2563eb"/>
          </linearGradient></defs>
          <rect width="40" height="40" rx="10" fill="url(#slg)"/>
          <path d="M13 11v18M13 20l8-9M13 20l9 9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="23" y="25" width="12" height="9" rx="2.5" fill="rgba(255,255,255,.2)"/>
          <text x="25" y="32.5" font-family="Arial Black,sans-serif" font-size="6" font-weight="900" fill="white" opacity=".92">123</text>
        </svg>
        <div class="sb-logo-txt">
          <span class="sb-name">{{ site.name }}</span>
          <span class="sb-sub">{{ site.subtitle }}</span>
        </div>
      </div>
      <nav class="sb-nav">
        <p class="sb-nav-ttl">分类导航</p>
        <a v-for="c in cats" :key="c.id" class="sb-it" :class="{act: active===c.id}"
          href="#" :title="c.label" @click.prevent="jump(c.id)">
          <span class="sb-ic">{{ c.icon }}</span>
          <span class="sb-lb">{{ c.label }}</span>
          <span class="sb-badge">{{ c.sites.length }}</span>
        </a>
      </nav>
      <div class="sb-foot">
        <a href="#">关于本站</a><a href="#">免责声明</a>
      </div>
    </aside>

    <div class="sb-handle" :class="{mini: sbCollapsed}" @click="sbCollapsed=!sbCollapsed"
      :title="sbCollapsed?'展开侧边栏':'收起侧边栏'">
      <span class="sb-handle-line"></span>
      <span class="sb-handle-line"></span>
      <span class="sb-handle-line"></span>
      <svg class="sb-handle-arrow" width="7" height="11" viewBox="0 0 7 11" fill="none">
        <path v-if="!sbCollapsed" d="M5.5 1L1 5.5l4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path v-else d="M1.5 1L6 5.5 1.5 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <div class="wrap" ref="wrapEl">

      <!-- ══ Banner ══ -->
      <header class="bn">

        <!-- 蓝色科技风全幅 SVG 背景 -->
        <svg class="bn-bg-svg" viewBox="0 0 1200 340"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <!-- 主背景渐变：深海蓝 → 宝蓝 → 钴蓝 -->
            <linearGradient id="bnbg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0"   stop-color="#0a0e27"/>
              <stop offset="0.4" stop-color="#0d1f6b"/>
              <stop offset="1"   stop-color="#1a3a8f"/>
            </linearGradient>
            <!-- 光晕渐变 -->
            <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
              <stop offset="0"   stop-color="#3b82f6" stop-opacity=".35"/>
              <stop offset="1"   stop-color="#3b82f6" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0"   stop-color="#818cf8" stop-opacity=".28"/>
              <stop offset="1"   stop-color="#818cf8" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
              <stop offset="0"   stop-color="#38bdf8" stop-opacity=".22"/>
              <stop offset="1"   stop-color="#38bdf8" stop-opacity="0"/>
            </radialGradient>
            <!-- 扁平山丘渐变 -->
            <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#1e3a8a" stop-opacity=".7"/>
              <stop offset="1" stop-color="#1e40af" stop-opacity=".9"/>
            </linearGradient>
            <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#1d4ed8" stop-opacity=".85"/>
              <stop offset="1" stop-color="#2563eb"/>
            </linearGradient>
            <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#1e40af"/>
              <stop offset="1" stop-color="#1e3a8a"/>
            </linearGradient>
            <!-- 树冠渐变 -->
            <linearGradient id="tree-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#60a5fa"/>
              <stop offset="1" stop-color="#2563eb"/>
            </linearGradient>
            <linearGradient id="tree-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#93c5fd"/>
              <stop offset="1" stop-color="#3b82f6"/>
            </linearGradient>
            <linearGradient id="tree-c" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#bfdbfe"/>
              <stop offset="1" stop-color="#60a5fa"/>
            </linearGradient>
            <!-- 电路线装饰 -->
            <filter id="gfx-blur">
              <feGaussianBlur stdDeviation="1.5"/>
            </filter>
          </defs>

          <!-- ① 主背景 -->
          <rect width="1200" height="340" fill="url(#bnbg)"/>

          <!-- ② 大光晕（营造氛围） -->
          <ellipse cx="200"  cy="160" rx="260" ry="200" fill="url(#glow2)"/>
          <ellipse cx="600"  cy="120" rx="320" ry="200" fill="url(#glow1)"/>
          <ellipse cx="1050" cy="180" rx="240" ry="180" fill="url(#glow3)"/>

          <!-- ③ 星点 -->
          <circle cx="80"  cy="28"  r="1.2" fill="#bfdbfe" opacity=".9"/>
          <circle cx="155" cy="14"  r="1"   fill="#e0f2fe" opacity=".8"/>
          <circle cx="240" cy="42"  r="1.5" fill="#bfdbfe" opacity=".7"/>
          <circle cx="340" cy="22"  r="1"   fill="#93c5fd" opacity=".85"/>
          <circle cx="420" cy="55"  r="1.2" fill="#e0f2fe" opacity=".7"/>
          <circle cx="530" cy="18"  r="1.5" fill="#bfdbfe" opacity=".9"/>
          <circle cx="640" cy="38"  r="1"   fill="#93c5fd" opacity=".75"/>
          <circle cx="720" cy="12"  r="1.3" fill="#e0f2fe" opacity=".8"/>
          <circle cx="820" cy="46"  r="1"   fill="#bfdbfe" opacity=".85"/>
          <circle cx="910" cy="22"  r="1.5" fill="#93c5fd" opacity=".7"/>
          <circle cx="1010" cy="50" r="1.2" fill="#e0f2fe" opacity=".8"/>
          <circle cx="1100" cy="30" r="1"   fill="#bfdbfe" opacity=".9"/>
          <circle cx="1170" cy="16" r="1.4" fill="#93c5fd" opacity=".75"/>
          <!-- 更多小星 -->
          <circle cx="50"  cy="80"  r=".8"  fill="#93c5fd" opacity=".6"/>
          <circle cx="190" cy="68"  r=".8"  fill="#bfdbfe" opacity=".55"/>
          <circle cx="310" cy="75"  r=".8"  fill="#e0f2fe" opacity=".5"/>
          <circle cx="470" cy="88"  r=".8"  fill="#93c5fd" opacity=".6"/>
          <circle cx="680" cy="72"  r=".8"  fill="#bfdbfe" opacity=".55"/>
          <circle cx="850" cy="82"  r=".8"  fill="#e0f2fe" opacity=".5"/>
          <circle cx="980" cy="65"  r=".8"  fill="#93c5fd" opacity=".6"/>
          <circle cx="1140" cy="78" r=".8"  fill="#bfdbfe" opacity=".55"/>

          <!-- ④ 流星划痕 -->
          <line x1="820" y1="25" x2="870" y2="55" stroke="white" stroke-width="1" opacity=".35" stroke-linecap="round"/>
          <line x1="280" y1="18" x2="315" y2="40" stroke="white" stroke-width=".8" opacity=".28" stroke-linecap="round"/>

          <!-- ⑤ 电路装饰线（科技感） -->
          <!-- 左侧电路 -->
          <polyline points="0,185 45,185 65,165 120,165 140,145 185,145"
            stroke="#60a5fa" stroke-width="1" fill="none" opacity=".3"/>
          <polyline points="0,210 30,210 50,230 90,230 110,210 160,210 180,190 220,190"
            stroke="#3b82f6" stroke-width="1" fill="none" opacity=".25"/>
          <circle cx="65"  cy="165" r="2.5" fill="#60a5fa" opacity=".5"/>
          <circle cx="140" cy="145" r="2.5" fill="#60a5fa" opacity=".5"/>
          <circle cx="110" cy="210" r="2"   fill="#3b82f6" opacity=".45"/>
          <!-- 右侧电路 -->
          <polyline points="1200,175 1155,175 1135,155 1090,155 1070,135 1020,135"
            stroke="#60a5fa" stroke-width="1" fill="none" opacity=".3"/>
          <polyline points="1200,200 1165,200 1145,220 1105,220 1085,200 1035,200"
            stroke="#3b82f6" stroke-width="1" fill="none" opacity=".25"/>
          <circle cx="1135" cy="155" r="2.5" fill="#60a5fa" opacity=".5"/>
          <circle cx="1070" cy="135" r="2.5" fill="#60a5fa" opacity=".5"/>
          <circle cx="1085" cy="200" r="2"   fill="#3b82f6" opacity=".45"/>
          <!-- 节点脉冲 -->
          <circle cx="65" cy="165" r="5" fill="#60a5fa" opacity=".15">
            <animate attributeName="r" values="3;7;3" dur="2.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".15;.05;.15" dur="2.4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="1135" cy="155" r="5" fill="#60a5fa" opacity=".15">
            <animate attributeName="r" values="3;7;3" dur="2.8s" begin=".6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".15;.05;.15" dur="2.8s" begin=".6s" repeatCount="indefinite"/>
          </circle>

          <!-- ⑥ 远山（极浅蓝，营造层次） -->
          <path d="M0 230 Q120 185 240 210 Q360 178 480 205 Q600 175 720 200 Q840 172 960 198 Q1080 175 1200 192 L1200 340 L0 340Z"
            fill="#1e3a8a" opacity=".55"/>
          <path d="M0 248 Q100 210 200 232 Q320 198 440 225 Q560 200 680 222 Q800 198 920 220 Q1040 200 1160 218 L1200 222 L1200 340 L0 340Z"
            fill="#1e40af" opacity=".6"/>

          <!-- ⑦ 扁平科技森林（蓝色圆形树冠） -->
          <!-- 远树（小，高透明） -->
          <rect x="55"  y="235" width="7"  height="50" rx="3" fill="#1e3a8a" opacity=".8"/>
          <circle cx="58"  cy="228" r="16" fill="#1e40af" opacity=".7"/>
          <circle cx="58"  cy="220" r="10" fill="#1d4ed8" opacity=".6"/>

          <rect x="118" y="228" width="8"  height="57" rx="4" fill="#1e3a8a" opacity=".8"/>
          <circle cx="122" cy="220" r="20" fill="#1e40af" opacity=".7"/>
          <circle cx="122" cy="210" r="13" fill="#1d4ed8" opacity=".65"/>
          <circle cx="122" cy="202" r="8"  fill="#2563eb" opacity=".6"/>

          <rect x="188" y="232" width="7"  height="53" rx="3" fill="#1e3a8a" opacity=".8"/>
          <circle cx="191" cy="225" r="17" fill="#1e40af" opacity=".7"/>
          <circle cx="191" cy="215" r="11" fill="#1d4ed8" opacity=".6"/>

          <!-- 左中树组 -->
          <rect x="258" y="222" width="10" height="63" rx="5" fill="#1e3a8a"/>
          <circle cx="263" cy="210" r="25" fill="url(#hill-mid)" opacity=".85"/>
          <circle cx="263" cy="198" r="18" fill="url(#tree-a)" opacity=".8"/>
          <circle cx="263" cy="188" r="11" fill="url(#tree-b)"/>

          <rect x="315" y="230" width="9"  height="55" rx="4" fill="#1e3a8a"/>
          <circle cx="319" cy="218" r="22" fill="url(#hill-mid)" opacity=".8"/>
          <circle cx="319" cy="208" r="15" fill="url(#tree-a)" opacity=".75"/>
          <circle cx="319" cy="200" r="9"  fill="url(#tree-b)"/>

          <!-- 左大树 -->
          <rect x="390" y="210" width="13" height="75" rx="6" fill="#1e3a8a"/>
          <circle cx="396" cy="196" r="34" fill="url(#hill-mid)" opacity=".9"/>
          <circle cx="396" cy="182" r="24" fill="url(#tree-a)" opacity=".85"/>
          <circle cx="396" cy="170" r="15" fill="url(#tree-b)"/>
          <circle cx="396" cy="160" r="8"  fill="url(#tree-c)"/>
          <!-- 树冠发光 -->
          <circle cx="396" cy="175" r="28" fill="#60a5fa" opacity=".06" filter="url(#gfx-blur)"/>

          <!-- 右大树 -->
          <rect x="795" y="208" width="13" height="77" rx="6" fill="#1e3a8a"/>
          <circle cx="801" cy="194" r="36" fill="url(#hill-mid)" opacity=".9"/>
          <circle cx="801" cy="179" r="26" fill="url(#tree-a)" opacity=".85"/>
          <circle cx="801" cy="167" r="16" fill="url(#tree-b)"/>
          <circle cx="801" cy="157" r="9"  fill="url(#tree-c)"/>
          <circle cx="801" cy="172" r="30" fill="#60a5fa" opacity=".06" filter="url(#gfx-blur)"/>

          <!-- 右中树组 -->
          <rect x="872" y="225" width="10" height="60" rx="5" fill="#1e3a8a"/>
          <circle cx="877" cy="213" r="24" fill="url(#hill-mid)" opacity=".8"/>
          <circle cx="877" cy="202" r="16" fill="url(#tree-a)" opacity=".75"/>
          <circle cx="877" cy="193" r="10" fill="url(#tree-b)"/>

          <rect x="932" y="230" width="9"  height="55" rx="4" fill="#1e3a8a"/>
          <circle cx="936" cy="219" r="20" fill="url(#hill-mid)" opacity=".78"/>
          <circle cx="936" cy="209" r="13" fill="url(#tree-a)" opacity=".72"/>

          <!-- 右侧远树 -->
          <rect x="1005" y="235" width="8"  height="50" rx="4" fill="#1e3a8a" opacity=".8"/>
          <circle cx="1009" cy="226" r="18" fill="#1e40af" opacity=".7"/>
          <circle cx="1009" cy="216" r="11" fill="#1d4ed8" opacity=".65"/>

          <rect x="1065" y="230" width="9"  height="55" rx="4" fill="#1e3a8a" opacity=".8"/>
          <circle cx="1069" cy="220" r="22" fill="#1e40af" opacity=".7"/>
          <circle cx="1069" cy="208" r="14" fill="#1d4ed8" opacity=".65"/>
          <circle cx="1069" cy="200" r="8"  fill="#2563eb" opacity=".6"/>

          <rect x="1130" y="235" width="8"  height="50" rx="4" fill="#1e3a8a" opacity=".8"/>
          <circle cx="1134" cy="227" r="17" fill="#1e40af" opacity=".68"/>
          <circle cx="1134" cy="217" r="10" fill="#1d4ed8" opacity=".6"/>

          <!-- ⑧ 科技小屋（蓝色调） -->
          <!-- 小屋主体 -->
          <rect x="520" y="248" width="52" height="37" rx="3" fill="#1e3a8a" opacity=".95"/>
          <!-- 屋顶 -->
          <polygon points="512,252 580,252 546,222" fill="#1d4ed8"/>
          <!-- 屋顶高光 -->
          <polygon points="512,252 546,222 546,252" fill="#2563eb" opacity=".4"/>
          <!-- 门 -->
          <rect x="537" y="263" width="14" height="22" rx="2" fill="#1d4ed8"/>
          <rect x="537" y="263" width="14" height="22" rx="2" fill="#60a5fa" opacity=".15"/>
          <!-- 窗（发光效果） -->
          <rect x="521" y="254" width="12" height="10" rx="1.5" fill="#bfdbfe" opacity=".7"/>
          <rect x="521" y="254" width="12" height="10" rx="1.5" fill="#60a5fa" opacity=".2">
            <animate attributeName="opacity" values=".2;.4;.2" dur="3s" repeatCount="indefinite"/>
          </rect>
          <rect x="559" y="254" width="12" height="10" rx="1.5" fill="#bfdbfe" opacity=".7"/>
          <rect x="559" y="254" width="12" height="10" rx="1.5" fill="#60a5fa" opacity=".2">
            <animate attributeName="opacity" values=".2;.38;.2" dur="2.5s" begin=".8s" repeatCount="indefinite"/>
          </rect>
          <!-- 烟囱 -->
          <rect x="562" y="229" width="8" height="23" rx="2" fill="#1e40af"/>
          <!-- 光粒子烟 -->
          <circle cx="566" cy="226" r="3" fill="#93c5fd" opacity=".5">
            <animate attributeName="cy" values="226;210;194" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".5;.2;0" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="3;4;2" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="568" cy="222" r="2.5" fill="#60a5fa" opacity=".4">
            <animate attributeName="cy" values="222;206;190" dur="3s" begin=".8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".4;.15;0" dur="3s" begin=".8s" repeatCount="indefinite"/>
          </circle>

          <!-- ⑨ 近景地面 -->
          <path d="M0 275 Q200 258 400 270 Q600 255 800 268 Q1000 255 1200 265 L1200 340 L0 340Z"
            fill="url(#hill-near)" opacity=".95"/>
          <!-- 地面线条纹理（科技网格） -->
          <line x1="0"    y1="295" x2="1200" y2="295" stroke="#3b82f6" stroke-width=".5" opacity=".2"/>
          <line x1="0"    y1="312" x2="1200" y2="312" stroke="#3b82f6" stroke-width=".5" opacity=".15"/>
          <line x1="150"  y1="275" x2="150"  y2="340" stroke="#3b82f6" stroke-width=".5" opacity=".15"/>
          <line x1="350"  y1="275" x2="350"  y2="340" stroke="#3b82f6" stroke-width=".5" opacity=".15"/>
          <line x1="550"  y1="275" x2="550"  y2="340" stroke="#3b82f6" stroke-width=".5" opacity=".15"/>
          <line x1="750"  y1="275" x2="750"  y2="340" stroke="#3b82f6" stroke-width=".5" opacity=".15"/>
          <line x1="950"  y1="275" x2="950"  y2="340" stroke="#3b82f6" stroke-width=".5" opacity=".15"/>
          <line x1="1100" y1="275" x2="1100" y2="340" stroke="#3b82f6" stroke-width=".5" opacity=".15"/>

          <!-- ⑩ 发光粒子（漂浮感） -->
          <circle cx="178" cy="192" r="2" fill="#60a5fa" opacity=".8">
            <animate attributeName="opacity" values=".8;.2;.8" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="192;185;192" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="456" cy="175" r="1.8" fill="#93c5fd" opacity=".7">
            <animate attributeName="opacity" values=".7;.15;.7" dur="1.9s" begin=".5s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="175;168;175" dur="1.9s" begin=".5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="688" cy="185" r="2" fill="#bfdbfe" opacity=".75">
            <animate attributeName="opacity" values=".75;.2;.75" dur="2.6s" begin="1s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="185;177;185" dur="2.6s" begin="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="944" cy="178" r="1.8" fill="#60a5fa" opacity=".7">
            <animate attributeName="opacity" values=".7;.18;.7" dur="2s" begin=".3s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="178;171;178" dur="2s" begin=".3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="1060" cy="188" r="2" fill="#93c5fd" opacity=".65">
            <animate attributeName="opacity" values=".65;.15;.65" dur="2.4s" begin=".9s" repeatCount="indefinite"/>
            <animate attributeName="cy" values="188;180;188" dur="2.4s" begin=".9s" repeatCount="indefinite"/>
          </circle>
        </svg>

        <!-- 中央内容区 -->
        <div class="bn-center">
          <div class="bn-badge">
            <span class="bn-badge-dot"></span>
            收录 <b>{{ totalCount }}</b> 个优质站点
          </div>
          <h1 class="bn-title">
            <span class="bn-title-pre">Hi，欢迎来到</span>
            <span class="bn-title-main">kuka<em>123</em> 导航</span>
          </h1>
          <p class="bn-desc">精选嵌入式开发 · AI 工具 · 效率利器，为开发者量身整理</p>

          <div class="bn-search" :class="{focus: sf}">
            <svg class="bn-s-ico" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input v-model="q" placeholder="搜索站点名称或关键词…"
              @focus="sf=true" @blur="sf=false" @keyup.enter="goSearch"/>
            <button v-if="q" class="bn-s-clr" @click="q=''">✕</button>
            <button class="bn-s-btn" @click="goSearch">搜索</button>
          </div>

          <div class="bn-tags">
            <button v-for="c in cats.slice(0,6)" :key="c.id" class="bn-tag" @click="jump(c.id)">
              {{ c.icon }} {{ c.label }}
            </button>
          </div>
        </div>

        <button class="bn-switch" @click="isDay=!isDay" :title="isDay?'切换夜晚':'切换白天'">
          <transition name="sw" mode="out-in">
            <span v-if="isDay" key="d">🌙</span>
            <span v-else key="n">☀️</span>
          </transition>
        </button>
      </header>

      <div class="content">
        <template v-if="q">
          <div class="sec" style="--si:0">
            <div class="sec-hd">
              <span class="sec-bar"></span><span class="sec-ic">🔍</span>
              <h2 class="sec-ttl">「{{ q }}」搜索结果</h2>
              <span class="sec-cnt">{{ results.length }}</span>
            </div>
            <div v-if="results.length" class="cards cards-ref">
              <SiteCard v-for="(s,j) in results" :key="s.url" :site="s" :idx="j"/>
            </div>
            <p v-else class="no-res">未找到「{{ q }}」，按 Enter 可百度搜索</p>
          </div>
        </template>
        <template v-else>
          <div v-for="(c,i) in cats" :key="c.id" :id="c.id" class="sec" :style="{'--si':i}">
            <div class="sec-hd">
              <span class="sec-bar"></span><span class="sec-ic">{{ c.icon }}</span>
              <h2 class="sec-ttl">{{ c.label }}</h2>
              <span class="sec-cnt">{{ c.sites.length }}</span>
            </div>
            <div class="cards" :class="i===0 ? 'cards-ref' : ''">
              <SiteCard v-for="(s,j) in c.sites" :key="s.url" :site="s" :idx="j"/>
            </div>
          </div>
          <div class="sec" :style="{'--si':cats.length}">
            <div class="sec-hd">
              <span class="sec-bar"></span><span class="sec-ic">🔗</span>
              <h2 class="sec-ttl">友情链接</h2>
            </div>
            <div class="friends">
              <a href="https://blog.csdn.net/weixin_45953517" target="_blank" rel="noopener" class="friend-lk">实用博客</a>
            </div>
          </div>
        </template>
      </div>

      <footer class="ft">
        <div class="ft-logo">
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#ftlg)"/>
            <path d="M13 11v18M13 20l8-9M13 20l9 9" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            <defs><linearGradient id="ftlg" x1="0" y1="0" x2="40" y2="40">
              <stop stop-color="#60a5fa"/><stop offset="1" stop-color="#2563eb"/>
            </linearGradient></defs>
          </svg>
          <span>{{ site.domain }}</span>
        </div>
        <div class="ft-info">
          <span>{{ site.copyright }}</span>
          <span v-if="site.icp" class="ft-sep">·</span>
          <a v-if="site.icp" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">{{ site.icp }}</a>
          <span v-if="site.design" class="ft-sep">·</span>
          <a v-if="site.design" href="https://github.com/WebStackPage/WebStackPage.github.io" target="_blank" rel="noopener">{{ site.design }}</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import SiteCard from './components/SiteCard.vue'

const isDay       = ref(true)
const sbCollapsed = ref(false)
const q           = ref('')
const sf          = ref(false)
const cats        = ref([])
const active      = ref('')
const wrapEl      = ref(null)

// 网站配置
const site = ref({
  name: 'kuka123',
  subtitle: '导 航 站',
  desc: 'KUKA导航 - 精选网址导航',
  icp: '沪ICP备2023014382号-1',
  copyright: 'Copyright © 2023–2026 KUKA 导航 · Jacksliwen 版权所有',
  domain: 'kuka123.cool',
  design: 'Design by Webstack'
})

// 从后端获取数据
async function loadCategories() {
  try {
    const res = await fetch('/api/categories')
    const data = await res.json()
    cats.value = data.categories || []
    if (data.site) {
      site.value = { ...site.value, ...data.site }
      // 更新页面标题和描述
      document.title = `${site.value.name} ${site.value.subtitle} | 主页`
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.content = site.value.desc
      }
    }
    if (cats.value.length > 0 && !active.value) {
      active.value = cats.value[0]?.id ?? ''
    }
  } catch (err) {
    console.error('加载数据失败:', err)
    cats.value = []
  }
}

const totalCount = computed(() => cats.value.reduce((s,c) => s+c.sites.length, 0))

const results = computed(() => {
  const kw = q.value.trim().toLowerCase()
  if (!kw) return []
  return cats.value.flatMap(c=>c.sites).filter(s =>
    s.name.toLowerCase().includes(kw) || s.desc.toLowerCase().includes(kw))
})

function goSearch() {
  if (!q.value.trim()) return
  if (!results.value.length)
    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(q.value)}`, '_blank')
}
function jump(id) {
  if (!id) return
  active.value = id; q.value = ''
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function calcCols(w) {
  const cols = Math.min(6, Math.max(1, Math.floor(w / 110)))
  document.documentElement.style.setProperty('--cols', String(cols))
}

let ro = null
onMounted(async () => {
  // 加载数据
  await loadCategories()

  const sd = localStorage.getItem('kuka-day')
  if (sd !== null) isDay.value = sd === '1'
  const sc = localStorage.getItem('kuka-sb')
  if (sc !== null) sbCollapsed.value = sc === '1'

  const io = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) active.value = e.target.id }),
    { threshold: .15, rootMargin: '-60px 0px -55% 0px' }
  )
  cats.value.forEach(c => { const el = document.getElementById(c.id); if (el) io.observe(el) })

  nextTick(() => {
    const cardsEl = document.querySelector('.cards-ref')
    if (!cardsEl) return
    ro = new ResizeObserver(entries => { calcCols(entries[0].contentRect.width) })
    ro.observe(cardsEl)
    calcCols(cardsEl.getBoundingClientRect().width)
  })
})
onUnmounted(() => ro?.disconnect())

watch(isDay,       v => localStorage.setItem('kuka-day', v ? '1' : '0'))
watch(sbCollapsed, v => localStorage.setItem('kuka-sb',  v ? '1' : '0'))
</script>

<style>
*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; font-size:clamp(11px,1.2vw,15px); overflow-x:hidden; }
body { overflow-x:hidden; }
a { text-decoration:none; color:inherit; }

.day {
  --bg:#ffffff; --bg2:#f8fbff; --border:#ede8e2;
  --text:#1a1612; --text2:#3d3530; --text3:#a09890;
  --acc:#2563eb; --acc2:#3b82f6;
  --card-bg:#ffffff; --card-bd:#e8e8ee; --card-hbd:#bfcfef; --card-hov-bg:#f8fbff;
  --ico-bg:#f5f2ee; --url-bg:#eff6ff; --url-bg-hov:#dbeafe;
  --sec-bar:linear-gradient(180deg,#3b82f6,#2563eb);
  --cnt-bg:rgba(59,130,246,.08); --cnt-col:#2563eb; --sec-ttl:#1a1612;
  --sec-bg:#fefcf9; --sec-bd:#f0e8dc;
  --fri-bg:#fefcf9; --fri-bd:#f0e8dc;
  --ft-bg:#faf7f3; --ft-bd:#ede5d8; --ft-text:#a09890; --ft-link:#6b5f57;
  --sb-bg:#ffffff; --sb-bd:#ede8e2; --sb-text:#6b5f57; --sb-text2:#1a1612;
  --sb-act-bg:rgba(59,130,246,.07); --sb-act:#2563eb; --sb-hov:rgba(0,0,0,.03);
  --sb-bgbg:#fefcf9; --sb-bgc:#a09890;
  --cols:6; --sbw:220px; --sbm:56px;
}

.night {
  --bg:#010509; --bg2:#0f2040; --border:rgba(96,165,250,.1);
  --text:#e2e8f0; --text2:#94a3b8; --text3:#475569;
  --acc:#60a5fa; --acc2:#93c5fd;
  --card-bg:#0d1a2e; --card-bd:rgba(96,165,250,.15); --card-hbd:rgba(96,165,250,.4); --card-hov-bg:#0f2040;
  --ico-bg:rgba(96,165,250,.1); --url-bg:rgba(96,165,250,.1); --url-bg-hov:rgba(96,165,250,.2);
  --sec-bar:linear-gradient(180deg,#60a5fa,#3b82f6);
  --cnt-bg:rgba(96,165,250,.1); --cnt-col:#60a5fa; --sec-ttl:#e2e8f0;
  --sec-bg:#070e1a; --sec-bd:rgba(96,165,250,.1);
  --fri-bg:#0d1730; --fri-bd:rgba(96,165,250,.1);
  --ft-bg:#010509; --ft-bd:rgba(96,165,250,.1); --ft-text:rgba(96,165,250,.36); --ft-link:rgba(96,165,250,.56);
  --sb-bg:#020810; --sb-bd:rgba(96,165,250,.1); --sb-text:rgba(96,165,250,.52);
  --sb-text2:rgba(224,232,255,.9); --sb-act-bg:rgba(96,165,250,.12); --sb-act:#60a5fa;
  --sb-hov:rgba(96,165,250,.05); --sb-bgbg:rgba(96,165,250,.08); --sb-bgc:rgba(96,165,250,.45);
  --cols:6; --sbw:220px; --sbm:56px;
}

body {
  font-family:'PingFang SC','Microsoft YaHei','Helvetica Neue',Arial,sans-serif;
  background:var(--bg); color:var(--text);
  min-height:100vh; -webkit-font-smoothing:antialiased;
  transition:background .4s,color .35s;
}

.layout { display:flex; min-height:100vh; overflow:hidden; width:100vw; }

/* ── 侧边栏 ── */
.sb { width:var(--sbw); background:var(--sb-bg); box-shadow:1px 0 0 0 var(--sb-bd); position:fixed; top:0; left:0; bottom:0; display:flex; flex-direction:column; overflow:hidden; z-index:300; transition:width .24s cubic-bezier(.4,0,.2,1),background .4s; will-change:width; transform:translateZ(0); }
.sb.mini { width:var(--sbm); }
.night .sb { box-shadow:1px 0 0 0 rgba(96,165,250,.08); }
.sb-handle { position:fixed; top:50vh; left:var(--sbw); transform:translateY(-50%); z-index:400; width:14px; height:44px; border-radius:0 6px 6px 0; background:var(--sb-bg); border:1px solid var(--sb-bd); border-left:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; box-shadow:2px 0 6px rgba(0,0,0,.07); transition:left .24s cubic-bezier(.4,0,.2,1),color .15s,background .2s; will-change:left; color:var(--text3); }
.sb-handle.mini { left:var(--sbm); }
.sb-handle:hover { color:var(--acc); background:var(--bg2); }
.night .sb-handle { border-color:rgba(96,165,250,.14); }
.sb-handle-line { display:block; width:4px; height:1.5px; border-radius:1px; background:currentColor; opacity:.6; }
.sb-handle-arrow { margin-top:2px; transition:opacity .2s; }
.sb-logo { display:flex; align-items:center; gap:13px; padding:22px 16px 18px; border-bottom:1px solid var(--sb-bd); flex-shrink:0; overflow:hidden; white-space:nowrap; min-height:84px; transition:padding .24s cubic-bezier(.4,0,.2,1), gap .24s cubic-bezier(.4,0,.2,1); }
.sb.mini .sb-logo { padding:22px 6px 18px; gap:0; }
.sb-logo svg { flex-shrink:0; transition:transform .24s cubic-bezier(.4,0,.2,1); }
.sb.mini .sb-logo svg { transform:scale(0.95); }
.sb-logo-txt { display:flex; flex-direction:column; line-height:1.25; transition:opacity .2s ease, width .2s ease, transform .2s ease; overflow:hidden; min-width:0; }
.sb.mini .sb-logo-txt { opacity:0; width:0; transform:translateX(-10px); }
.sb-name { font-size:1.4rem; font-weight:800; color:var(--text); letter-spacing:-.02em; }
.sb-name em { color:var(--acc); font-style:normal; }
.sb-sub { font-size:.76rem; color:var(--text3); letter-spacing:.12em; margin-top:2px; }
.sb-nav { flex:1; overflow-y:auto; overflow-x:hidden; padding:6px; scrollbar-width:none; }
.sb-nav::-webkit-scrollbar { display:none; }
.sb-nav-ttl { font-size:.58rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--text3); padding:0 8px 6px; white-space:nowrap; overflow:hidden; transition:opacity .2s ease, height .2s ease, padding .2s ease; }
.sb.mini .sb-nav-ttl { opacity:0; height:0; padding:0; }
.sb-it { display:flex; align-items:center; gap:8px; padding:7px 9px; border-radius:7px; color:var(--sb-text); font-size:.9rem; cursor:pointer; transition:background .13s,color .13s,gap .24s cubic-bezier(.4,0,.2,1); white-space:nowrap; overflow:hidden; position:relative; margin-bottom:1px; }
.sb-it:hover { background:var(--sb-hov); color:var(--sb-text2); }
.sb-it.act { background:var(--sb-act-bg); color:var(--sb-act); font-weight:600; }
.sb-ic { font-size:.95rem; flex-shrink:0; transition:transform .24s cubic-bezier(.4,0,.2,1); }
.sb.mini .sb-ic { transform:scale(1.15); }
.sb-lb { flex:1; font-size:.88rem; transition:opacity .18s ease, width .18s ease; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sb.mini .sb-lb { opacity:0; width:0; }
.sb-badge { font-size:.6rem; background:var(--sb-bgbg); color:var(--sb-bgc); padding:1px 5px; border-radius:999px; flex-shrink:0; transition:opacity .18s ease, width .18s ease, padding .18s ease; }
.sb.mini .sb-badge { opacity:0; width:0; padding:0 0; }
.sb-it.act .sb-badge { color:var(--acc); background:var(--cnt-bg); }
.sb.mini .sb-it::after { content:attr(title); position:absolute; left:calc(100% + 10px); top:50%; transform:translateY(-50%); background:var(--text); color:var(--bg); font-size:.75rem; padding:3px 9px; border-radius:5px; white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .13s; z-index:999; box-shadow:0 2px 8px rgba(0,0,0,.14); }
.sb.mini .sb-it:hover::after { opacity:1; }
.sb-foot { padding:8px 10px; border-top:1px solid var(--sb-bd); display:flex; gap:10px; flex-shrink:0; overflow:hidden; flex-wrap:wrap; }
.sb-foot a { font-size:.68rem; color:var(--text3); transition:color .13s; white-space:nowrap; }
.sb-foot a:hover { color:var(--acc); }
.sb.mini .sb-foot { justify-content:center; }
.sb.mini .sb-foot a { display:none; }

.wrap { margin-left:var(--sbw); flex:1; min-width:0; overflow:hidden; display:flex; flex-direction:column; min-height:100vh; transition:margin-left .24s cubic-bezier(.4,0,.2,1); will-change:margin-left; }
.sb.mini ~ .wrap { margin-left:var(--sbm); }

/* ══ Banner ══ */
.bn {
  position:relative;
  overflow:hidden;
  display:flex; align-items:center; justify-content:center;
  min-height:clamp(260px,32vw,360px);
}

/* 整图 SVG 背景铺满 */
.bn-bg-svg {
  position:absolute; inset:0;
  width:100%; height:100%;
  pointer-events:none;
}

/* 内容居中，文字全白 */
.bn-center {
  position:relative; z-index:2;
  display:flex; flex-direction:column;
  align-items:center; text-align:center;
  gap:clamp(10px,1.4vw,16px);
  padding:clamp(28px,4vw,48px) clamp(20px,3vw,40px);
  width:100%; max-width:560px;
}

/* 徽章 */
.bn-badge {
  display:inline-flex; align-items:center; gap:7px;
  font-size:.7rem; font-weight:500; letter-spacing:.05em;
  color:#bfdbfe;
  background:rgba(37,99,235,.25);
  border:1px solid rgba(96,165,250,.4);
  padding:4px 14px; border-radius:999px;
  backdrop-filter:blur(10px);
}
.bn-badge b { font-weight:700; color:#e0f2fe; }
.bn-badge-dot {
  width:6px; height:6px; border-radius:50%;
  background:#60a5fa;
  box-shadow:0 0 0 3px rgba(96,165,250,.25);
  animation:bdot 2.5s ease-in-out infinite; flex-shrink:0;
}
@keyframes bdot {
  0%,100% { box-shadow:0 0 0 3px rgba(96,165,250,.25); }
  50%      { box-shadow:0 0 0 7px rgba(96,165,250,.08); }
}

/* 标题 */
.bn-title { display:flex; flex-direction:column; gap:3px; line-height:1.12; }
.bn-title-pre {
  font-size:clamp(.84rem,1.1vw,1rem); font-weight:500;
  color:#93c5fd; letter-spacing:.05em;
}
.bn-title-main {
  font-size:clamp(2rem,4vw,3.2rem); font-weight:900;
  color:#ffffff; letter-spacing:-.04em;
  text-shadow:0 0 40px rgba(96,165,250,.5), 0 2px 12px rgba(0,0,0,.4);
}
.bn-title-main em {
  font-style:normal;
  background:linear-gradient(120deg,#60a5fa,#93c5fd,#38bdf8);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  filter:drop-shadow(0 0 12px rgba(96,165,250,.6));
}

.bn-desc {
  font-size:clamp(.74rem,.96vw,.86rem);
  color:#bfdbfe; letter-spacing:.03em;
  text-shadow:0 1px 6px rgba(0,0,0,.4);
}

/* 搜索框 */
.bn-search {
  display:flex; align-items:center; gap:8px;
  height:clamp(42px,5.5vw,50px); padding:0 6px 0 16px;
  border-radius:14px;
  background:rgba(14,30,80,.75);
  border:1.5px solid rgba(96,165,250,.35);
  box-shadow:0 4px 24px rgba(0,0,0,.3), 0 0 0 0 rgba(96,165,250,0);
  backdrop-filter:blur(14px);
  width:100%; max-width:430px;
  transition:border-color .18s,box-shadow .18s;
}
.bn-search.focus {
  border-color:#60a5fa;
  box-shadow:0 4px 24px rgba(0,0,0,.3), 0 0 0 3px rgba(96,165,250,.2);
}
.bn-s-ico { color:#60a5fa; flex-shrink:0; }
.bn-search input {
  flex:1; border:none; outline:none; background:transparent;
  font-size:.9rem; color:#e0f2fe; font-family:inherit;
}
.bn-search input::placeholder { color:#6b9fd4; opacity:.8; }
.bn-s-clr { background:none; border:none; cursor:pointer; color:#6b9fd4; font-size:.72rem; padding:2px 4px; transition:color .13s; }
.bn-s-clr:hover { color:#93c5fd; }
.bn-s-btn {
  height:clamp(32px,4.5vw,38px); padding:0 18px; border-radius:10px; border:none;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:#fff; font-size:.84rem; font-weight:600; font-family:inherit;
  cursor:pointer; flex-shrink:0;
  box-shadow:0 2px 14px rgba(37,99,235,.5);
  transition:opacity .18s,transform .13s,box-shadow .18s;
}
.bn-s-btn:hover {
  opacity:.92; transform:scale(.98);
  box-shadow:0 4px 20px rgba(37,99,235,.65);
}

/* 分类标签 */
.bn-tags { display:flex; flex-wrap:wrap; justify-content:center; gap:6px; }
.bn-tag {
  display:inline-flex; align-items:center; gap:4px;
  padding:4px 12px; border-radius:8px; font-size:.7rem;
  font-family:inherit; cursor:pointer;
  background:rgba(30,58,138,.45);
  border:1px solid rgba(96,165,250,.28);
  color:#bfdbfe;
  backdrop-filter:blur(8px);
  transition:background .15s,transform .15s,border-color .15s,color .15s,box-shadow .15s;
}
.bn-tag:hover {
  transform:translateY(-2px);
  border-color:#60a5fa; color:#e0f2fe;
  background:rgba(37,99,235,.4);
  box-shadow:0 4px 12px rgba(37,99,235,.3);
}

/* 日夜切换 */
.bn-switch {
  position:absolute; top:16px; right:18px; z-index:10;
  width:34px; height:34px; border-radius:50%;
  border:1.5px solid rgba(96,165,250,.35);
  background:rgba(14,30,80,.6); backdrop-filter:blur(8px);
  cursor:pointer; font-size:.95rem;
  display:flex; align-items:center; justify-content:center;
  transition:transform .15s,background .2s;
  box-shadow:0 1px 8px rgba(0,0,0,.3);
}
.bn-switch:hover { transform:scale(1.1); background:rgba(37,99,235,.4); }
.sw-enter-active,.sw-leave-active { transition:all .15s; }
.sw-enter-from { opacity:0; transform:rotate(-30deg) scale(.8); }
.sw-leave-to   { opacity:0; transform:rotate(30deg)  scale(.8); }

/* ══ 内容区 ══ */
.content { flex:1; padding:clamp(10px,1.5vw,16px); padding-bottom:10px; background:var(--bg); transition:background .4s; min-width:0; }
@keyframes fUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

.sec { margin-bottom:clamp(8px,1.2vw,14px); scroll-margin-top:14px; background:var(--sec-bg); border:1px solid var(--sec-bd); border-radius:clamp(8px,1vw,12px); padding:clamp(10px,1.2vw,14px); animation:fUp .28s ease calc(var(--si,0)*.04s) both; transition:background .4s,border-color .4s; }
.sec-hd { display:flex; align-items:center; gap:7px; margin-bottom:clamp(8px,1vw,11px); }
.sec-bar { display:inline-block; width:3px; height:15px; border-radius:2px; flex-shrink:0; }
.sec:nth-child(10n+1)  .sec-bar { background:linear-gradient(180deg,#3b82f6,#2563eb); }
.sec:nth-child(10n+2)  .sec-bar { background:linear-gradient(180deg,#8b5cf6,#6d28d9); }
.sec:nth-child(10n+3)  .sec-bar { background:linear-gradient(180deg,#ec4899,#db2777); }
.sec:nth-child(10n+4)  .sec-bar { background:linear-gradient(180deg,#10b981,#059669); }
.sec:nth-child(10n+5)  .sec-bar { background:linear-gradient(180deg,#f59e0b,#d97706); }
.sec:nth-child(10n+6)  .sec-bar { background:linear-gradient(180deg,#06b6d4,#0891b2); }
.sec:nth-child(10n+7)  .sec-bar { background:linear-gradient(180deg,#f97316,#ea580c); }
.sec:nth-child(10n+8)  .sec-bar { background:linear-gradient(180deg,#64748b,#475569); }
.sec:nth-child(10n+9)  .sec-bar { background:linear-gradient(180deg,#a855f7,#9333ea); }
.sec:nth-child(10n+10) .sec-bar { background:linear-gradient(180deg,#14b8a6,#0d9488); }
.sec-ic  { font-size:.9rem; }
.sec-ttl { font-size:.88rem; font-weight:700; color:var(--sec-ttl); flex:1; transition:color .4s; }
.sec-cnt { font-size:.6rem; font-weight:600; color:var(--cnt-col); background:var(--cnt-bg); padding:2px 7px; border-radius:999px; }

.cards { display:grid; grid-template-columns:repeat(var(--cols,6),minmax(0,1fr)); gap:clamp(5px,.8vw,8px); padding:4px 2px; }

/* 响应式网格布局 - 根据窗口宽度自动调整列数 */
@media (max-width:1400px) { .cards { --cols:5; } }
@media (max-width:1200px) { .cards { --cols:4; } }
@media (max-width:960px)  { .cards { --cols:3; } }
@media (max-width:680px)  { .cards { --cols:2; } }
@media (max-width:420px)  { .cards { --cols:1; } }

.friends { display:flex; flex-wrap:wrap; gap:7px; }
.friend-lk { padding:4px 12px; border-radius:6px; border:1px solid var(--fri-bd); background:var(--fri-bg); color:var(--text2); font-size:.75rem; transition:all .15s; }
.friend-lk:hover { border-color:var(--acc); color:var(--acc); }
.no-res { color:var(--text3); text-align:center; padding:48px; font-size:.84rem; }

/* ══ Footer ══ */
.ft { background:var(--ft-bg); border-top:1px solid var(--ft-bd); padding:14px 20px; display:flex; flex-direction:column; align-items:center; gap:6px; transition:background .4s,border-color .4s; }
.ft-logo { display:flex; align-items:center; gap:6px; font-size:.82rem; font-weight:700; color:var(--acc); }
.ft-logo b { color:var(--acc2); }
.ft-info { display:flex; align-items:center; flex-wrap:wrap; justify-content:center; gap:5px; font-size:.65rem; color:var(--ft-text); }
.ft-info a { color:var(--ft-link); transition:color .13s; }
.ft-info a:hover { color:var(--acc); }
.ft-sep { opacity:.3; }

/* ══ 响应式 ══ */
@media (max-width:1100px) { .day,.night { --sbw:200px; } }
@media (max-width:860px) {
  .day,.night { --sbw:var(--sbm); }
  .sb { width:var(--sbm) !important; }
  .sb-logo-txt,.sb-lb { opacity:0; width:0; }
  .sb-badge { opacity:0; width:0; padding:0; }
  .sb-nav-ttl { opacity:0; height:0; padding:0; }
  .sb-foot a { display:none; }
  .sb-foot { justify-content:center; }
  .sb-logo { padding:18px 0 13px; justify-content:center; }
  .sb-handle { display:none; }
  .wrap { margin-left:var(--sbm) !important; }
}
@media (max-width:680px) {
  .layout { flex-direction:column; overflow:visible; width:100%; }
  .sb { position:relative; width:100% !important; height:auto; flex-direction:row; align-items:center; padding:0 12px; border-bottom:1px solid var(--sb-bd); box-shadow:none; overflow:visible; }
  .sb-logo { padding:10px 0; border-bottom:none; min-height:auto; flex-shrink:0; }
  .sb-logo-txt { opacity:1 !important; width:auto !important; }
  .sb-nav { flex:1; display:flex; flex-direction:row; flex-wrap:nowrap; overflow-x:auto; overflow-y:visible; padding:8px; gap:2px; scrollbar-width:none; }
  .sb-nav::-webkit-scrollbar { display:none; }
  .sb-nav-ttl { display:none; }
  .sb-it { flex-shrink:0; padding:5px 10px; font-size:.8rem; white-space:nowrap; }
  .sb-lb { opacity:1 !important; width:auto !important; font-size:.8rem; }
  .sb-badge { opacity:1 !important; width:auto !important; padding:1px 5px !important; }
  .sb-foot,.sb-handle { display:none; }
  .wrap { margin-left:0 !important; overflow:visible; min-width:0; }
  .content { overflow:visible; padding:10px; }
  .sec { padding:10px; }
  .bn-tags { display:none; }
  .bn-center { padding:24px 20px 20px; }
}
@media (max-width:420px) {
  .sb-it { padding:4px 8px; font-size:.75rem; }
  .sb-lb { font-size:.75rem; }
  .sec { padding:8px; border-radius:8px; }
  .ft-info { font-size:.6rem; }
  .bn-title-main { font-size:1.8rem; }
}
</style>