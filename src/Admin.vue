<template>
  <div class="adm" :class="dark?'dark':'light'">

    <!-- 侧边栏 -->
    <aside class="adm-sb" :class="{collapsed}">
      <div class="adm-sb-logo">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <defs><linearGradient id="ag" x1="0" y1="0" x2="40" y2="40">
            <stop stop-color="#60a5fa"/><stop offset="1" stop-color="#2563eb"/>
          </linearGradient></defs>
          <rect width="40" height="40" rx="10" fill="url(#ag)"/>
          <path d="M13 11v18M13 20l8-9M13 20l9 9" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="adm-sb-brand" v-show="!collapsed">
          <span class="brand-name">KUKA<em>123</em></span>
          <span class="brand-sub">管理后台</span>
        </div>
      </div>

      <nav class="adm-sb-nav">
        <div class="nav-group-label" v-show="!collapsed">内容管理</div>
        <button v-for="t in tabs" :key="t.id"
          class="nav-item" :class="{act:tab===t.id}"
          @click="tab=t.id" :title="collapsed ? t.label : ''">
          <span class="nav-icon">{{ t.icon }}</span>
          <span class="nav-label" v-show="!collapsed">{{ t.label }}</span>
          <span class="nav-badge" v-if="t.badge && !collapsed">{{ t.badge }}</span>
        </button>
      </nav>

      <div class="adm-sb-foot">
        <button class="nav-item" @click="collapsed=!collapsed" :title="collapsed?'展开':'收起'">
          <span class="nav-icon">{{ collapsed ? '→' : '←' }}</span>
          <span class="nav-label" v-show="!collapsed">收起菜单</span>
        </button>
        <button class="nav-item danger-item" @click="logout" title="退出登录">
          <span class="nav-icon">🚪</span>
          <span class="nav-label" v-show="!collapsed">退出登录</span>
        </button>
      </div>
    </aside>

    <!-- 主区域 -->
    <div class="adm-main-wrap">

      <!-- 顶栏 -->
      <header class="adm-topbar">
        <div class="adm-topbar-l">
          <h2 class="adm-page-title">{{ currentTab?.label }}</h2>
          <div class="adm-breadcrumb">
            <span>KUKA 导航</span>
            <span class="bc-sep">/</span>
            <span>{{ currentTab?.label }}</span>
          </div>
        </div>
        <div class="adm-topbar-r">
          <!-- 统计快览 -->
          <div class="topbar-stats">
            <span class="ts-item">
              <b>{{ cats.length }}</b> 分类
            </span>
            <span class="ts-sep">·</span>
            <span class="ts-item">
              <b>{{ totalSites }}</b> 站点
            </span>
          </div>
          <div class="topbar-divider"></div>
          <!-- 保存状态 -->
          <span class="save-status" :class="{ saving: saving }">
            {{ saving ? '保存中...' : '已自动保存' }}
          </span>
          <div class="topbar-divider"></div>
          <button class="tbtn ghost" @click="dark=!dark" :title="dark?'切换亮色':'切换暗色'">
            {{ dark ? '☀️' : '🌙' }}
          </button>
          <a class="tbtn ghost" href="/" target="_blank" title="预览前台">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              <path d="M9 1h4v4M13 1L7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            预览前台
          </a>
        </div>
      </header>

      <!-- 内容 -->
      <main class="adm-content">

        <!-- ① 仪表盘概览 -->
        <section v-show="tab==='dashboard'" class="adm-sec">
          <div class="dash-cards">
            <div class="dash-card blue">
              <div class="dc-icon">📂</div>
              <div class="dc-info">
                <div class="dc-num">{{ cats.length }}</div>
                <div class="dc-lbl">分类总数</div>
              </div>
            </div>
            <div class="dash-card indigo">
              <div class="dc-icon">🔗</div>
              <div class="dc-info">
                <div class="dc-num">{{ totalSites }}</div>
                <div class="dc-lbl">站点总数</div>
              </div>
            </div>
            <div class="dash-card teal">
              <div class="dc-icon">⭐</div>
              <div class="dc-info">
                <div class="dc-num">{{ maxCat?.sites.length || 0 }}</div>
                <div class="dc-lbl">最大分类站点数</div>
              </div>
            </div>
            <div class="dash-card orange">
              <div class="dc-icon">🌐</div>
              <div class="dc-info">
                <div class="dc-num">{{ site.domain || '未设置' }}</div>
                <div class="dc-lbl">当前域名</div>
              </div>
            </div>
          </div>

          <!-- 网站信息概览 -->
          <div class="dash-site-info">
            <div class="dsi-hd">
              <span class="dsi-title">🌐 网站信息</span>
              <button class="tbtn-sm primary" @click="tab='site'">编辑设置 →</button>
            </div>
            <div class="dsi-grid">
              <div class="dsi-item">
                <span class="dsi-label">网站名称</span>
                <span class="dsi-value">{{ site.name }}</span>
              </div>
              <div class="dsi-item">
                <span class="dsi-label">副标题</span>
                <span class="dsi-value">{{ site.subtitle }}</span>
              </div>
              <div class="dsi-item">
                <span class="dsi-label">备案号</span>
                <span class="dsi-value">{{ site.icp || '未设置' }}</span>
              </div>
              <div class="dsi-item">
                <span class="dsi-label">设计来源</span>
                <span class="dsi-value">{{ site.design }}</span>
              </div>
              <div class="dsi-item full">
                <span class="dsi-label">网站描述</span>
                <span class="dsi-value">{{ site.desc }}</span>
              </div>
              <div class="dsi-item full">
                <span class="dsi-label">版权信息</span>
                <span class="dsi-value">{{ site.copyright }}</span>
              </div>
            </div>
          </div>

          <div class="dash-table-wrap">
            <div class="dash-table-hd">
              <span>分类概览</span>
              <button class="tbtn-sm primary" @click="tab='cats'">管理分类 →</button>
            </div>
            <table class="dash-table">
              <thead>
                <tr>
                  <th>图标</th><th>分类名称</th><th>站点数</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in cats" :key="c.id">
                  <td>{{ c.icon }}</td>
                  <td>{{ c.label }}</td>
                  <td><span class="tbadge">{{ c.sites.length }}</span></td>
                  <td>
                    <button class="tbtn-sm ghost" @click="jumpToCat(c.id)">管理站点</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ② 网站设置 -->
        <section v-show="tab==='site'" class="adm-sec">
          <div class="sec-card">
            <div class="sc-hd">
              <h3 class="sc-title">基本信息</h3>
              <p class="sc-desc">修改网站名称、备案号等基础信息</p>
            </div>
            <div class="sc-body">
              <div class="form-grid">
                <div class="fg-item" v-for="f in siteFields" :key="f.key">
                  <label class="fg-label">{{ f.label }}</label>
                  <input class="fg-input" v-model="site[f.key]" :placeholder="f.ph"/>
                  <p class="fg-hint" v-if="f.hint">{{ f.hint }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="alert info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/>
              <path d="M8 7v5M8 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            修改完成后，数据会自动保存到服务器。
          </div>
        </section>

        <!-- ③ 分类管理 -->
        <section v-show="tab==='cats'" class="adm-sec">
          <div class="sec-toolbar">
            <div class="st-left">
              <span class="st-count">共 {{ cats.length }} 个分类</span>
              <span class="st-hint" v-if="cats.length > 1">💡 拖拽行可调整排序</span>
            </div>
            <button class="tbtn primary" @click="addCat">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              添加分类
            </button>
          </div>

          <div class="cat-table-wrap">
            <table class="cat-table">
              <thead>
                <tr>
                  <th style="width:48px">排序</th>
                  <th style="width:64px">图标</th>
                  <th>分类名称</th>
                  <th style="width:80px">站点数</th>
                  <th style="width:140px">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(c,ci) in cats" :key="c.id" 
                    :draggable="dragCatIndex === ci"
                    @dragstart="catDragStart(ci)"
                    @dragover.prevent="catDragOver(ci)"
                    @drop="catDrop(ci)"
                    @dragend="catDragEnd">
                  <td>
                    <div class="drag-handle" title="拖拽排序" @mousedown="catDragStart(ci)">⋮⋮</div>
                  </td>
                  <td><input class="inline-inp ico" :value="c.icon" @blur="c.icon = $event.target.value" placeholder="📁"/></td>
                  <td><input class="inline-inp full" :value="c.label" @blur="c.label = $event.target.value" placeholder="分类名称"/></td>
                  <td><span class="tbadge">{{ c.sites.length }}</span></td>
                  <td>
                    <div class="row-acts">
                      <button class="tbtn-sm ghost" @click="jumpToCat(c.id)">管理站点</button>
                      <button class="tbtn-sm danger" @click="delCat(ci)">删除</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!cats.length">
                  <td colspan="5" class="empty-row">暂无分类，点击「添加分类」</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ④ 网址管理 -->
        <section v-show="tab==='sites'" class="adm-sec">
          <div class="sec-toolbar">
            <div class="st-left">
              <label class="filter-label">当前分类</label>
              <select class="filter-select" v-model="curCatId">
                <option v-for="c in cats" :key="c.id" :value="c.id">
                  {{ c.icon }} {{ c.label }} ({{ c.sites.length }})
                </option>
              </select>
              <span class="st-count" v-if="curCat">{{ curCat.sites.length }} 个站点</span>
            </div>
            <div class="st-right">
              <button class="tbtn" @click="checkAllSites" :disabled="checkingAll">
                <span v-if="checkingAll">⏳ 检测中...</span>
                <span v-else>🔍 一键检测网址</span>
              </button>
              <button class="tbtn primary" @click="addSite">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
                添加网址
              </button>
            </div>
          </div>

          <div class="site-table-wrap" v-if="curCat">
            <table class="site-table">
              <thead>
                <tr>
                  <th style="width:40px">排序</th>
                  <th style="width:44px">图标</th>
                  <th style="width:80px">状态</th>
                  <th style="width:120px">名称</th>
                  <th>网址 URL</th>
                  <th>图标 URL</th>
                  <th>描述</th>
                  <th style="width:80px">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(s,si) in curCat.sites" :key="s.name + s.url"
                    :draggable="dragIndex === si"
                    @dragstart="dragStart(si)"
                    @dragover.prevent="dragOver(si)"
                    @drop="drop(si)"
                    @dragend="dragEnd">
                  <td><div class="drag-handle" @mousedown="dragStart(si)">⋮⋮</div></td>
                  <td>
                    <div class="site-ico-wrap">
                      <img v-if="getFaviconUrl(s)" 
                        :src="getFaviconUrl(s)"
                        @error="onIconError"
                        style="width:28px;height:28px;object-fit:contain;border-radius:5px"/>
                      <span v-else class="site-fb">{{ s.name?.[0]?.toUpperCase()||'?' }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="site-status" :class="getSiteStatus(s)" @click="checkSite(s)" title="点击检测">
                      <span class="status-dot"></span>
                      <span class="status-text">{{ getStatusText(getSiteStatus(s)) }}</span>
                    </div>
                  </td>
                  <td><input class="cell-inp" :value="s.name" @blur="s.name = $event.target.value" placeholder="网站名称"/></td>
                  <td><input class="cell-inp" :value="s.url" @blur="s.url = $event.target.value; autoFetchIcon(s)" placeholder="https://..."/></td>
                  <td>
                    <div class="favicon-cell">
                      <input class="cell-inp" :value="s.favicon" @blur="s.favicon = $event.target.value" placeholder="自动获取或手动填写"/>
                      <button v-if="s.url" class="tbtn-sm" @click="fetchIcon(s)" title="重新获取图标">🔄</button>
                    </div>
                  </td>
                  <td><input class="cell-inp" :value="s.desc" @blur="s.desc = $event.target.value" placeholder="简介描述"/></td>
                  <td><button class="tbtn-sm danger" @click="delSite(si)">删除</button></td>
                </tr>
                <tr v-if="!curCat.sites.length">
                  <td colspan="7" class="empty-row">该分类暂无站点，点击「添加网址」</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>


      </main>
    </div>

    <!-- Toast 通知 -->
    <transition name="toast">
      <div class="adm-toast" v-if="toastShow">
        <span class="toast-icon">{{ toastIcon }}</span>
        {{ toastMsg }}
      </div>
    </transition>

    <!-- 自定义确认弹窗 -->
    <transition name="modal">
      <div v-if="modalShow" class="modal-overlay" @click.self="modalCancel">
        <div class="modal-box">
          <div class="modal-hd">
            <h4 class="modal-title">{{ modalTitle }}</h4>
          </div>
          <div class="modal-body">
            <p class="modal-msg">{{ modalMsg }}</p>
          </div>
          <div class="modal-ft">
            <button class="tbtn" @click="modalCancel">取消</button>
            <button class="tbtn primary" @click="modalConfirm">确定</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router    = useRouter()
const dark      = ref(false)
const collapsed = ref(false)
const tab       = ref('dashboard')
const toastShow = ref(false)
const toastMsg  = ref('')
const toastIcon = ref('✅')
const saving    = ref(false)
const cats      = reactive([])
const curCatId = ref('')

// 拖拽排序相关
const dragIndex = ref(-1)
const dragOverIndex = ref(-1)
const dragData = ref(null)  // 存储被拖动的数据

// 网址状态检测
const checkingAll = ref(false)
const siteStatusMap = reactive(new Map()) // 存储网址检测状态

// 计算网址插入位置
function getSiteInsertIndex() {
  if (dragIndex.value === -1) return -1
  if (dragOverIndex.value === -1) return -1
  // 如果目标位置就是当前位置，不显示占位符
  if (dragOverIndex.value === dragIndex.value) return -1
  // 如果目标在源之后，返回目标位置
  if (dragOverIndex.value > dragIndex.value) {
    return dragOverIndex.value
  }
  // 如果目标在源之前，返回目标位置
  return dragOverIndex.value
}

// 分类拖拽排序相关
const dragCatIndex = ref(-1)
const dragCatOverIndex = ref(-1)
const dragCatData = ref(null)  // 存储被拖动的数据

// 计算插入位置
function getCatInsertIndex() {
  if (dragCatIndex.value === -1) return -1
  if (dragCatOverIndex.value === -1) return -1
  // 如果目标位置就是当前位置，不显示占位符
  if (dragCatOverIndex.value === dragCatIndex.value) return -1
  // 如果目标在源之后，返回目标位置（因为源会被移除）
  if (dragCatOverIndex.value > dragCatIndex.value) {
    return dragCatOverIndex.value
  }
  // 如果目标在源之前，返回目标位置
  return dragCatOverIndex.value
}

// 弹窗相关
const modalShow = ref(false)
const modalTitle = ref('确认操作')
const modalMsg = ref('')
let modalResolve = null
let modalReject = null

// 从后端加载数据
async function loadCategories() {
  try {
    const res = await fetch(`/api/categories`)
    const data = await res.json()
    cats.splice(0, cats.length, ...(data.categories || []))
    if (cats.length > 0 && !curCatId.value) {
      curCatId.value = cats[0]?.id ?? ''
    }
    // 加载网站配置
    if (data.site && Object.keys(data.site).length > 0) {
      Object.assign(site, data.site)
    }
  } catch (err) {
    console.error('加载数据失败:', err)
    toast('加载数据失败', '❌')
  }
}

// 自动保存到后端
async function saveToServer() {
  saving.value = true
  try {
    const res = await fetch(`/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: cats, site })
    })
    if (!res.ok) throw new Error('保存失败')
    toast('已自动保存', '💾')
  } catch (err) {
    toast('保存失败: ' + err.message, '❌')
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCategories()
})

// 监听标签切换，切换到网址管理时自动检测
watch(tab, (newTab) => {
  if (newTab === 'sites' && curCat.value?.sites.length) {
    // 延迟一点执行，确保DOM已渲染
    setTimeout(() => {
      checkAllSites()
    }, 300)
  }
})

// 监听分类切换，切换到网址管理页面时自动检测
watch(curCatId, () => {
  if (tab.value === 'sites' && curCat.value?.sites.length) {
    // 延迟一点执行，确保DOM已渲染
    setTimeout(() => {
      checkAllSites()
    }, 300)
  }
})

const tabs = [
  { id:'dashboard', icon:'📊', label:'概览仪表盘' },
  { id:'site',      icon:'⚙️',  label:'网站设置'   },
  { id:'cats',      icon:'📂', label:'分类管理'   },
  { id:'sites',     icon:'🔗', label:'网址管理'   },
]

const currentTab = computed(() => tabs.find(t => t.id === tab.value))

/* ── 网站配置 ── */
const site = reactive({
  name:'kuka123', subtitle:'导 航 站',
  desc:'KUKA导航 - 精选网址导航，收录软件官网、学习资源、AI工具、效率工具等优质网站',
  icp:'沪ICP备2023014382号-1',
  copyright:'Copyright © 2023–2026 KUKA 导航 · Jacksliwen 版权所有',
  domain:'kuka123.cool', design:'Design by Webstack',
})
const siteFields = [
  { key:'name',      label:'网站名称',  ph:'kuka123',         hint:'' },
  { key:'subtitle',  label:'副标题',    ph:'导 航 站',        hint:'' },
  { key:'desc',      label:'网站描述',  ph:'精选工具导航...',  hint:'用于 SEO meta 描述' },
  { key:'domain',    label:'域名',      ph:'kuka123.cool',    hint:'' },
  { key:'icp',       label:'备案号',    ph:'沪ICP备XXXXXXXX号-1', hint:'留空则不显示' },
  { key:'copyright', label:'版权信息',  ph:'Copyright © 2026...', hint:'' },
  { key:'design',    label:'设计来源',  ph:'Design by Webstack',  hint:'' },
]

/* ── 分类数据 ── */

// 监听数据变化，自动保存
watch(cats, () => {
  scheduleSave()
}, { deep: true })

watch(site, () => {
  scheduleSave()
}, { deep: true })

let saveTimer = null
function scheduleSave() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(saveToServer, 500) // 500ms 防抖
}

const totalSites = computed(() => cats.reduce((s,c)=>s+c.sites.length, 0))
const maxCat     = computed(() => cats.reduce((a,b)=>a.sites.length>b.sites.length?a:b, cats[0]||{sites:[]}))

const curCat   = computed(() => cats.find(c=>c.id===curCatId.value))

/* ── 跳转到指定分类的网址管理 ── */
function jumpToCat(id) {
  curCatId.value = id
  tab.value = 'sites'
}

/* ── 分类操作 ── */
function addCat() {
  const id = 'cat_' + Date.now()
  cats.push({ id, icon:'📁', label:'新分类', sites:[] })
  curCatId.value = id
  tab.value = 'sites'
  toast('分类已添加', '✅')
  scheduleSave()
}
function delCat(ci) {
  showConfirm('删除分类', `确定删除分类「${cats[ci].label}」及其 ${cats[ci].sites.length} 个站点？此操作不可恢复。`).then(() => {
    const id = cats[ci].id
    cats.splice(ci, 1)
    if (curCatId.value === id) curCatId.value = cats[0]?.id ?? ''
    toast('分类已删除', '🗑️')
    scheduleSave()
  }).catch(() => {})
}
function moveCat(ci, d) {
  const to = ci + d
  if (to < 0 || to >= cats.length) return
  ;[cats[ci], cats[to]] = [cats[to], cats[ci]]
  scheduleSave()
}

/* ── 分类拖拽排序 ── */
function catDragStart(index) {
  dragCatIndex.value = index
}

function catDragOver(index) {
  dragOverIndex.value = index
}

function catDrop(index) {
  const fromIndex = dragCatIndex.value
  if (fromIndex === -1 || fromIndex === index) {
    dragCatIndex.value = -1
    return
  }
  // 交换位置
  const item = cats.splice(fromIndex, 1)[0]
  cats.splice(index, 0, item)
  dragCatIndex.value = -1
  scheduleSave()
}

function catDragEnd() {
  dragCatIndex.value = -1
}

/* ── 网址操作 ── */
function addSite() {
  curCat.value?.sites.push({ name:'', url:'', favicon:'', desc:'' })
  scheduleSave()
}

// 获取图标URL（带备用方案）
function getFaviconUrl(site) {
  // 优先使用已有的favicon
  if (site.favicon) return site.favicon
  // 其次尝试根据URL生成
  if (site.url) {
    try {
      const url = new URL(site.url)
      return `${url.origin}/favicon.ico`
    } catch {
      return ''
    }
  }
  return ''
}

// 图标加载失败处理
function onIconError(e) {
  // 尝试备用方案：使用DuckDuckGo图标服务
  const img = e.target
  const currentSrc = img.src
  
  // 如果已经是DuckDuckGo的图标，则隐藏显示首字母
  if (currentSrc.includes('duckduckgo.com')) {
    img.style.display = 'none'
    return
  }
  
  // 尝试从当前行获取URL
  const row = img.closest('tr')
  if (row) {
    const urlInput = row.querySelector('input[placeholder*="https"]')
    if (urlInput && urlInput.value) {
      try {
        const domain = new URL(urlInput.value).hostname
        img.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`
        return
      } catch {}
    }
  }
  
  // 最终备用：隐藏图片显示首字母
  img.style.display = 'none'
}

// 获取状态文本
function getStatusText(status) {
  const map = {
    'ok': '正常',
    'slow': '较慢',
    'error': '异常',
    'checking': '检测中',
    'unknown': '未检测'
  }
  return map[status] || '未检测'
}

// 检测单个网址
async function checkSite(site) {
  if (!site.url) {
    Object.assign(site, { _status: 'error', _responseTime: 0 })
    return
  }
  
  Object.assign(site, { _status: 'checking' })
  
  try {
    const start = Date.now()
    const img = new Image()
    // 尝试加载favicon来检测连通性
    const checkUrl = site.favicon || (site.url + '/favicon.ico')
    
    await new Promise((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => resolve() // 加载失败也继续，可能有响应但无图标
      img.src = checkUrl + '?t=' + Date.now()
      setTimeout(() => reject(new Error('timeout')), 5000)
    })
    
    const time = Date.now() - start
    
    if (time < 1000) {
      Object.assign(site, { _status: 'ok', _responseTime: time })
    } else if (time < 3000) {
      Object.assign(site, { _status: 'slow', _responseTime: time })
    } else {
      Object.assign(site, { _status: 'error', _responseTime: time })
    }
  } catch (err) {
    Object.assign(site, { _status: 'error', _responseTime: 0 })
  }
}

// 获取状态（兼容旧数据）
function getSiteStatus(site) {
  return site._status || 'unknown'
}

// 一键检测所有网址
async function checkAllSites() {
  if (!curCat.value?.sites.length) return
  
  checkingAll.value = true
  const sites = curCat.value.sites.filter(s => s.url)
  
  // 批量检测，每次5个
  const batchSize = 5
  for (let i = 0; i < sites.length; i += batchSize) {
    const batch = sites.slice(i, i + batchSize)
    await Promise.all(batch.map(site => checkSite(site)))
  }
  
  checkingAll.value = false
  const okCount = sites.filter(s => s._status === 'ok').length
  toast(`检测完成，${okCount}/${sites.length} 个网址正常`, '✅')
}

// 自动获取网站图标
function autoFetchIcon(site) {
  if (!site.url || site.favicon) return
  fetchIcon(site)
}

// 获取网站 favicon
async function fetchIcon(site) {
  if (!site.url) return
  
  try {
    // 解析 URL 获取域名
    let url = site.url
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    const protocol = urlObj.protocol
    
    // 优先使用网站自身的 favicon.ico
    const selfHostedIcon = `${protocol}//${domain}/favicon.ico`
    
    // 测试自身图标是否可用
    const iconAvailable = await testImage(selfHostedIcon)
    
    if (iconAvailable) {
      site.favicon = selfHostedIcon
    } else {
      // 备用：使用 Google Favicon Service
      site.favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    }
    
    scheduleSave()
  } catch (err) {
    console.error('获取图标失败:', err)
  }
}

// 测试图片是否可用
function testImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
    // 2秒超时
    setTimeout(() => resolve(false), 2000)
  })
}

function delSite(si) {
  showConfirm('删除网址', `确定删除「${curCat.value.sites[si].name || '该站点'}」？`).then(() => {
    curCat.value?.sites.splice(si, 1)
    scheduleSave()
  }).catch(() => {})
}
function moveSite(si, d) {
  const ss = curCat.value?.sites
  if (!ss) return
  const to = si + d
  if (to < 0 || to >= ss.length) return
  ;[ss[si], ss[to]] = [ss[to], ss[si]]
  scheduleSave()
}

// 拖拽排序处理
function dragStart(index) {
  dragIndex.value = index
}

function dragOver(index) {
  dragOverIndex.value = index
}

function drop(index) {
  const fromIndex = dragIndex.value
  if (fromIndex === -1 || fromIndex === index) {
    dragIndex.value = -1
    return
  }
  const ss = curCat.value?.sites
  if (!ss) {
    dragIndex.value = -1
    return
  }
  // 交换位置
  const item = ss.splice(fromIndex, 1)[0]
  ss.splice(index, 0, item)
  dragIndex.value = -1
  scheduleSave()
}

function dragEnd() {
  dragIndex.value = -1
}

/* ── 退出登录 ── */
function logout() {
  showConfirm('退出登录', '确定退出登录？').then(() => {
    sessionStorage.removeItem('kuka_admin_auth')
    router.push('/admin/login')
  }).catch(() => {})
}

/* ── Toast ── */
let toastTimer = null
function toast(msg, icon='✅') {
  toastMsg.value = msg; toastIcon.value = icon; toastShow.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(()=>toastShow.value=false, 3000)
}

/* ── 自定义弹窗 ── */
function showConfirm(title, msg) {
  return new Promise((resolve, reject) => {
    modalTitle.value = title
    modalMsg.value = msg
    modalShow.value = true
    modalResolve = resolve
    modalReject = reject
  })
}
function modalConfirm() {
  modalShow.value = false
  if (modalResolve) modalResolve()
  modalResolve = null
  modalReject = null
}
function modalCancel() {
  modalShow.value = false
  if (modalReject) modalReject()
  modalResolve = null
  modalReject = null
}

</script>

<style scoped>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

.adm {
  display: flex; min-height:100vh; width:100vw;
  font-family:'PingFang SC','Microsoft YaHei',Arial,sans-serif;
  font-size:14px; -webkit-font-smoothing:antialiased;
}

/* ── 主题变量 ── */
.light {
  --bg:#f0f4f8; --bg2:#ffffff; --sb-bg:#1e293b; --sb-text:rgba(255,255,255,.65);
  --sb-text-act:#ffffff; --sb-act-bg:rgba(255,255,255,.12); --sb-hover:rgba(255,255,255,.08);
  --bd:#e2e8f0; --text:#0f172a; --text2:#64748b; --text3:#94a3b8;
  --acc:#2563eb; --acc-h:#1d4ed8; --danger:#ef4444; --danger-h:#dc2626;
  --success:#059669;
  --inp-bg:#ffffff; --inp-bd:#e2e8f0;
  --card-bg:#ffffff; --card-bd:#e2e8f0;
  --pre-bg:#0f172a; --pre-c:#94a3b8;
  --tbl-hd:#f8fafc; --tbl-bd:#e2e8f0; --tbl-row-hov:#f8fafc;
}
.dark {
  --bg:#0f172a; --bg2:#1e293b; --sb-bg:#0a0f1e; --sb-text:rgba(255,255,255,.55);
  --sb-text-act:#ffffff; --sb-act-bg:rgba(96,165,250,.15); --sb-hover:rgba(255,255,255,.06);
  --bd:rgba(148,163,184,.12); --text:#f1f5f9; --text2:#94a3b8; --text3:#475569;
  --acc:#60a5fa; --acc-h:#3b82f6; --danger:#f87171; --danger-h:#ef4444;
  --success:#34d399;
  --inp-bg:#1e293b; --inp-bd:rgba(148,163,184,.15);
  --card-bg:#1e293b; --card-bd:rgba(148,163,184,.1);
  --pre-bg:#020817; --pre-c:#64748b;
  --tbl-hd:#0f172a; --tbl-bd:rgba(148,163,184,.1); --tbl-row-hov:rgba(255,255,255,.03);
}

/* ── 侧边栏 ── */
.adm-sb {
  width: 220px; flex-shrink:0;
  background: var(--sb-bg);
  display: flex; flex-direction:column;
  position: sticky; top:0; height:100vh;
  transition: width .22s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}
.adm-sb.collapsed { width: 60px; }

.adm-sb-logo {
  display: flex; align-items:center; gap:10px;
  padding: 18px 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  flex-shrink:0; overflow:hidden; white-space:nowrap;
}
.adm-sb-brand { display:flex; flex-direction:column; }
.brand-name { font-size:1.05rem; font-weight:800; color:#fff; letter-spacing:-.01em; }
.brand-name em { font-style:normal; color:#60a5fa; }
.brand-sub { font-size:.62rem; color:rgba(255,255,255,.4); margin-top:1px; letter-spacing:.05em; }

.adm-sb-nav { flex:1; padding:10px 8px; overflow-y:auto; overflow-x:hidden; scrollbar-width:none; }
.adm-sb-nav::-webkit-scrollbar { display:none; }

.nav-group-label {
  font-size:.58rem; font-weight:700; letter-spacing:.12em;
  text-transform:uppercase; color:rgba(255,255,255,.3);
  padding:12px 8px 4px; white-space:nowrap; overflow:hidden;
}

.nav-item {
  display: flex; align-items:center; gap:10px;
  width:100%; padding:9px 10px; border-radius:8px; border:none;
  background:transparent; color:var(--sb-text);
  font-size:.875rem; font-family:inherit; cursor:pointer;
  text-align:left; white-space:nowrap; overflow:hidden;
  transition:background .14s,color .14s;
  position:relative;
}
.nav-item:hover { background:var(--sb-hover); color:rgba(255,255,255,.85); }
.nav-item.act { background:var(--sb-act-bg); color:var(--sb-text-act); font-weight:600; }
.nav-item.act::before {
  content:''; position:absolute; left:0; top:50%; transform:translateY(-50%);
  width:3px; height:60%; border-radius:0 2px 2px 0;
  background:var(--acc);
}
.nav-icon { font-size:1rem; flex-shrink:0; width:20px; text-align:center; }
.nav-label { flex:1; }
.nav-badge { font-size:.6rem; background:rgba(255,255,255,.15); padding:1px 6px; border-radius:999px; }
.danger-item { color:rgba(248,113,113,.7); }
.danger-item:hover { background:rgba(239,68,68,.1); color:#fca5a5; }

.adm-sb-foot {
  padding:8px; border-top:1px solid rgba(255,255,255,.08);
  display:flex; flex-direction:column; gap:2px; flex-shrink:0;
}

/* ── 主区域 ── */
.adm-main-wrap {
  flex:1; display:flex; flex-direction:column;
  background:var(--bg); min-width:0; overflow:hidden;
}

/* ── 顶栏 ── */
.adm-topbar {
  height:58px; background:var(--bg2);
  border-bottom:1px solid var(--bd);
  display:flex; align-items:center; justify-content:space-between;
  padding:0 24px; flex-shrink:0;
  position:sticky; top:0; z-index:50;
}
.adm-topbar-l { display:flex; flex-direction:column; gap:2px; }
.adm-page-title { font-size:.95rem; font-weight:700; color:var(--text); }
.adm-breadcrumb { font-size:.7rem; color:var(--text3); display:flex; align-items:center; gap:4px; }
.bc-sep { opacity:.4; }

.adm-topbar-r { display:flex; align-items:center; gap:8px; }
.topbar-stats { display:flex; align-items:center; gap:6px; font-size:.78rem; color:var(--text2); }
.topbar-stats b { color:var(--text); font-weight:700; }
.ts-sep { opacity:.3; }
.topbar-divider { width:1px; height:20px; background:var(--bd); margin:0 4px; }

/* 保存状态 */
.save-status {
  font-size: .75rem;
  color: var(--success);
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(5, 150, 105, 0.1);
  transition: all .2s;
}
.save-status.saving {
  color: var(--acc);
  background: rgba(37, 99, 235, 0.1);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .6; }
}

/* ── 按钮 ── */
.tbtn {
  display:inline-flex; align-items:center; gap:5px;
  padding:7px 14px; border-radius:8px; border:none;
  font-size:.82rem; font-weight:600; font-family:inherit;
  cursor:pointer; transition:all .15s; text-decoration:none;
  white-space:nowrap;
}
.tbtn.primary { background:var(--acc); color:#fff; box-shadow:0 1px 4px rgba(37,99,235,.3); }
.tbtn.primary:hover { background:var(--acc-h); box-shadow:0 2px 8px rgba(37,99,235,.4); }
.tbtn.ghost { background:transparent; color:var(--text2); border:1px solid var(--bd); }
.tbtn.ghost:hover { color:var(--text); border-color:var(--acc); }

.tbtn-sm {
  display:inline-flex; align-items:center; gap:4px;
  padding:4px 10px; border-radius:6px; border:none;
  font-size:.76rem; font-weight:600; font-family:inherit;
  cursor:pointer; transition:all .15s;
}
.tbtn-sm.primary { background:var(--acc); color:#fff; }
.tbtn-sm.primary:hover { background:var(--acc-h); }
.tbtn-sm.ghost { background:transparent; color:var(--text2); border:1px solid var(--bd); }
.tbtn-sm.ghost:hover { color:var(--acc); border-color:var(--acc); }
.tbtn-sm.danger { background:transparent; color:var(--danger); border:1px solid rgba(239,68,68,.3); }
.tbtn-sm.danger:hover { background:rgba(239,68,68,.08); }

/* ── 内容区 ── */
.adm-content { flex:1; padding:24px; overflow-y:auto; overflow-x:hidden; }
.adm-sec { max-width:1100px; margin:0 auto; width:100%; }

/* 响应式适配 */
@media (max-width:1200px) {
  .dash-cards { grid-template-columns:repeat(2, 1fr); }
  .dsi-grid { grid-template-columns:repeat(2, 1fr); }
}
@media (max-width:900px) {
  .dash-cards { grid-template-columns:repeat(2, 1fr); }
  .dsi-grid { grid-template-columns:1fr; }
  .form-grid { grid-template-columns:1fr; }
}
@media (max-width:768px) {
  .adm-sb { position:fixed; z-index:200; height:100vh; }
  .adm-main-wrap { margin-left:60px; }
  .adm-sb:not(.collapsed) { width:220px; box-shadow:4px 0 20px rgba(0,0,0,.3); }
  .topbar-stats { display:none; }
  .adm-content { padding:14px; }
  .form-grid { grid-template-columns:1fr; }
  .dash-cards { grid-template-columns:1fr; }
  .dsi-grid { grid-template-columns:1fr; }
  /* 表格横向滚动 */
  .dash-table-wrap, .cat-table-wrap, .site-table-wrap { overflow-x:auto; }
}
@media (max-width:480px) {
  .adm-content { padding:10px; }
  .adm-topbar { padding:0 14px; }
  .dc-num { font-size:1.2rem; }
  .sec-toolbar { flex-direction:column; align-items:flex-start; }
}

/* 工具栏 */
.sec-toolbar {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:16px; flex-wrap:wrap; gap:10px;
}
.st-left { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.st-count { font-size:.8rem; color:var(--text3); }
.st-hint { font-size:.75rem; color:var(--text2); margin-left:12px; }

/* 仪表盘 */
.dash-cards { display:grid; grid-template-columns:repeat(4, 1fr); gap:14px; margin-bottom:24px; }
@media (max-width: 1200px) {
  .dash-cards { grid-template-columns:repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .dash-cards { grid-template-columns:1fr; }
}
.dash-card {
  background:var(--card-bg); border:1px solid var(--card-bd);
  border-radius:12px; padding:18px 20px;
  display:flex; align-items:center; gap:14px;
  transition:box-shadow .15s;
  min-width:0;
}
.dash-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.08); }
.dc-icon { font-size:1.8rem; flex-shrink:0; }
.dc-info { flex:1; min-width:0; overflow:hidden; }
.dc-num { font-size:1.4rem; font-weight:800; color:var(--text); line-height:1.3; word-break:break-all; }
.dc-lbl { font-size:.72rem; color:var(--text3); margin-top:4px; }
.dash-card.blue  { border-left:3px solid #3b82f6; }
.dash-card.indigo{ border-left:3px solid #6366f1; }
.dash-card.teal  { border-left:3px solid #14b8a6; }
.dash-card.orange{ border-left:3px solid #f97316; }

/* 网站信息概览 */
.dash-site-info {
  background: var(--card-bg);
  border: 1px solid var(--card-bd);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}
.dsi-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--tbl-bd);
  background: linear-gradient(135deg, rgba(37,99,235,.05) 0%, transparent 100%);
}
.dsi-title {
  font-size: .9rem;
  font-weight: 600;
  color: var(--text);
}
.dsi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 18px;
}
.dsi-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dsi-item.full {
  grid-column: 1 / -1;
}
.dsi-label {
  font-size: .7rem;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: .05em;
}
.dsi-value {
  font-size: .85rem;
  color: var(--text);
  font-weight: 500;
  line-height: 1.4;
}

.dash-table-wrap { background:var(--card-bg); border:1px solid var(--card-bd); border-radius:12px; overflow:hidden; }
.dash-table-hd {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px; border-bottom:1px solid var(--tbl-bd);
  font-size:.88rem; font-weight:600; color:var(--text);
}
.dash-table { width:100%; border-collapse:collapse; }
.dash-table th { background:var(--tbl-hd); padding:10px 16px; text-align:left; font-size:.76rem; color:var(--text2); font-weight:600; border-bottom:1px solid var(--tbl-bd); }
.dash-table td { padding:10px 16px; font-size:.84rem; color:var(--text); border-bottom:1px solid var(--tbl-bd); }
.dash-table tr:last-child td { border-bottom:none; }
.dash-table tr:hover td { background:var(--tbl-row-hov); }

/* 卡片区块 */
.sec-card { background:var(--card-bg); border:1px solid var(--card-bd); border-radius:12px; overflow:hidden; margin-bottom:16px; }
.sc-hd { padding:18px 22px 14px; border-bottom:1px solid var(--tbl-bd); }
.sc-title { font-size:.92rem; font-weight:700; color:var(--text); }
.sc-desc { font-size:.76rem; color:var(--text3); margin-top:3px; }
.sc-desc code { font-family:monospace; background:rgba(37,99,235,.08); padding:1px 5px; border-radius:4px; color:var(--acc); }
.sc-body { padding:22px; }

/* 表单网格 */
.form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px; }
@media (max-width:768px) {
  .form-grid { grid-template-columns:1fr; gap:14px; }
}
.fg-item { display:flex; flex-direction:column; gap:5px; }
.fg-label { font-size:.78rem; font-weight:600; color:var(--text2); }
.fg-input {
  height:36px; padding:0 12px; border-radius:8px;
  border:1px solid var(--inp-bd); background:var(--inp-bg); color:var(--text);
  font-size:.88rem; font-family:inherit; outline:none;
  transition:border-color .15s,box-shadow .15s;
}
.fg-input:focus { border-color:var(--acc); box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.fg-hint { font-size:.7rem; color:var(--text3); }

/* 分类表格 */
.cat-table-wrap { background:var(--card-bg); border:1px solid var(--card-bd); border-radius:12px; overflow:hidden; }
.cat-table { width:100%; border-collapse:collapse; }
.cat-table th { background:var(--tbl-hd); padding:10px 14px; text-align:left; font-size:.75rem; color:var(--text2); font-weight:600; border-bottom:1px solid var(--tbl-bd); }
.cat-table td { padding:8px 14px; border-bottom:1px solid var(--tbl-bd); vertical-align:middle; }
.cat-table tr:last-child td { border-bottom:none; }
.cat-table tr:hover td { background:var(--tbl-row-hov); }

/* 分类拖拽样式 */
.cat-row { 
  cursor: grab; 
  transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.cat-row.dragging { 
  opacity: 1;
  cursor: grabbing; 
  background: white; 
  box-shadow: 0 12px 40px rgba(0,0,0,.25), 0 0 0 2px var(--acc); 
  transform: scale(1.03) rotate(1deg); 
  z-index: 1000;
  border-radius: 12px;
}
.cat-row.drag-source {
  height: 6px !important;
  overflow: hidden;
  opacity: 0.3;
  background: var(--acc);
  border: none;
  border-radius: 3px;
  margin: 6px 12px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.3);
}
.cat-row.drag-source td {
  padding: 0;
  height: 0;
}
.cat-row.drag-source td > * {
  display: none;
}
.cat-row .drag-handle { 
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 8px;
  color: var(--text3); cursor: grab;
  background: var(--bg2);
  transition: all .2s ease;
}
.cat-row .drag-handle:hover { 
  color: var(--acc); 
  background: rgba(37,99,235,.1);
  transform: scale(1.1);
}
.cat-row .drag-handle:active {
  cursor: grabbing;
  transform: scale(0.95);
}
.cat-row.dragging .drag-handle { 
  cursor: grabbing;
  background: var(--acc);
  color: white;
}
/* 拖拽占位符 - 显示为空位 */
.cat-placeholder {
  height: 56px;
  background: linear-gradient(135deg, rgba(37,99,235,.12) 0%, rgba(59,130,246,.08) 100%);
  border: 2px dashed var(--acc);
  border-radius: 12px;
  margin: 8px 0;
  position: relative;
  animation: placeholder-pulse 1s ease-in-out infinite;
}
.cat-placeholder::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 4px;
  background: var(--acc);
  border-radius: 2px;
  opacity: 0.6;
}
.cat-placeholder td {
  padding: 0;
  border: none;
}
.placeholder-line {
  display: none;
}
@keyframes placeholder-pulse {
  0%, 100% { 
    opacity: 0.7; 
    transform: scale(0.98);
    box-shadow: 0 0 0 0 rgba(37,99,235,.2);
  }
  50% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 20px 4px rgba(37,99,235,.15);
  }
}

/* 网址表格 */
.site-table-wrap { background:var(--card-bg); border:1px solid var(--card-bd); border-radius:12px; overflow:hidden; overflow-x:auto; }
.site-table { width:100%; border-collapse:collapse; min-width:700px; }
.site-table th { background:var(--tbl-hd); padding:9px 10px; text-align:left; font-size:.73rem; color:var(--text2); font-weight:600; border-bottom:1px solid var(--tbl-bd); white-space:nowrap; }
.site-table td { padding:6px 10px; border-bottom:1px solid var(--tbl-bd); vertical-align:middle; }
.site-table tr:last-child td { border-bottom:none; }
.site-table .site-row:hover td { background:var(--tbl-row-hov); }

.site-ico-wrap {
  width:28px; height:28px; border-radius:6px;
  background:rgba(37,99,235,.07); overflow:hidden;
  display:flex; align-items:center; justify-content:center;
  position: relative;
}
.site-ico-wrap img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.site-fb { 
  font-size:.7rem; 
  font-weight:700; 
  color:var(--acc);
  z-index: 0;
}

/* 内联输入框 */
.inline-inp {
  height:30px; padding:0 8px; border-radius:6px;
  border:1px solid transparent; background:transparent; color:var(--text);
  font-size:.84rem; font-family:inherit; outline:none;
  transition:border-color .15s,background .15s;
}
.inline-inp:hover { border-color:var(--inp-bd); background:var(--inp-bg); }
.inline-inp:focus { border-color:var(--acc); background:var(--inp-bg); box-shadow:0 0 0 2px rgba(37,99,235,.1); }
.inline-inp.ico { width:48px; text-align:center; font-size:1rem; }
.inline-inp.full { width:100%; }

.cell-inp {
  width:100%; height:28px; padding:0 8px; border-radius:5px;
  border:1px solid transparent; background:transparent; color:var(--text);
  font-size:.82rem; font-family:inherit; outline:none;
  transition:border-color .15s,background .15s;
}
.cell-inp:hover { border-color:var(--inp-bd); background:var(--inp-bg); }
.cell-inp:focus { border-color:var(--acc); background:var(--inp-bg); box-shadow:0 0 0 2px rgba(37,99,235,.1); }

/* 图标单元格 */
.favicon-cell { display:flex; gap:5px; align-items:center; }
.favicon-cell .cell-inp { flex:1; }
.favicon-cell .tbtn-sm { flex-shrink:0; padding:0 6px; height:28px; }

/* 网址状态指示灯 */
.site-status {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all .2s;
  font-size: .75rem;
  white-space: nowrap;
}
.site-status:hover {
  background: var(--bg2);
}
.site-status .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all .3s;
}
.site-status .status-text {
  color: var(--text2);
}

/* 状态颜色 */
.site-status.ok .status-dot {
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}
.site-status.ok .status-text {
  color: #22c55e;
}
.site-status.slow .status-dot {
  background: #fbbf24;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
}
.site-status.slow .status-text {
  color: #fbbf24;
}
.site-status.error .status-dot {
  background: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}
.site-status.error .status-text {
  color: #ef4444;
}
.site-status.checking .status-dot {
  background: #f59e0b;
  animation: status-pulse 1s ease-in-out infinite;
}
.site-status.checking .status-text {
  color: #f59e0b;
}
.site-status.unknown .status-dot {
  background: #9ca3af;
}
.site-status.unknown .status-text {
  color: #9ca3af;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* 排序按钮 */
.sort-btns { display:flex; flex-direction:column; gap:2px; }
.sbt {
  width:22px; height:18px; border-radius:4px; border:1px solid var(--bd);
  background:var(--bg2); color:var(--text2); font-size:.65rem; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:all .12s;
}
.sbt:hover:not(:disabled) { border-color:var(--acc); color:var(--acc); background:rgba(37,99,235,.06); }
.sbt:disabled { opacity:.25; cursor:not-allowed; }

/* 拖拽排序基础样式 */
.drag-handle {
  cursor: grab;
  user-select: none;
  padding: 4px 8px;
  color: var(--text3);
  font-size: 14px;
  letter-spacing: 2px;
}
.drag-handle:active {
  cursor: grabbing;
}
tr[draggable="true"] {
  cursor: grab;
}
tr[draggable="true"]:active {
  cursor: grabbing;
}

/* 网址表格 */
.site-table-wrap { background:var(--card-bg); border:1px solid var(--card-bd); border-radius:12px; overflow:hidden; overflow-x:auto; }

/* 通用 */
.tbadge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:.7rem; font-weight:600; background:rgba(37,99,235,.08); color:var(--acc); }
.row-acts { display:flex; gap:5px; }
.filter-label { font-size:.8rem; color:var(--text2); }
.filter-select {
  height:32px; padding:0 10px; border-radius:7px;
  border:1px solid var(--inp-bd); background:var(--inp-bg); color:var(--text);
  font-size:.82rem; font-family:inherit; outline:none; cursor:pointer;
}
.filter-select:focus { border-color:var(--acc); }
.empty-row { text-align:center; color:var(--text3); padding:28px; font-size:.84rem; }

/* 导出 */
.export-bar { display:flex; align-items:center; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
.copy-ok { font-size:.8rem; color:var(--success); font-weight:600; }
.code-preview {
  background:var(--pre-bg); color:var(--pre-c);
  padding:16px; border-radius:10px;
  font-size:.76rem; font-family:'SF Mono','Consolas','Monaco',monospace;
  overflow:auto; white-space:pre; line-height:1.7; max-height:55vh;
  border:1px solid var(--tbl-bd);
}

/* 提示框 */
.alert {
  display:flex; align-items:flex-start; gap:9px;
  padding:12px 14px; border-radius:9px; font-size:.8rem; line-height:1.6;
}
.alert.info { background:rgba(37,99,235,.06); color:var(--acc); border:1px solid rgba(37,99,235,.14); }
.alert code { font-family:monospace; background:rgba(37,99,235,.12); padding:1px 5px; border-radius:4px; }

/* Toast */
.adm-toast {
  position:fixed; bottom:28px; right:28px; z-index:9999;
  background:var(--text); color:var(--bg2);
  padding:11px 18px; border-radius:10px;
  font-size:.84rem; font-weight:500;
  box-shadow:0 8px 28px rgba(0,0,0,.2);
  display:flex; align-items:center; gap:8px;
  pointer-events:none; white-space:nowrap;
}
.toast-icon { font-size:1rem; }
.toast-enter-active,.toast-leave-active { transition:all .25s; }
.toast-enter-from { opacity:0; transform:translateY(12px) scale(.95); }
.toast-leave-to   { opacity:0; transform:translateY(12px) scale(.95); }

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-box {
  background: var(--bg2);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
  min-width: 320px;
  max-width: 420px;
  width: 100%;
  animation: modal-in .3s cubic-bezier(.4,0,.2,1);
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(.9) translateY(-20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-hd {
  padding: 20px 20px 0;
}
.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}
.modal-body {
  padding: 16px 20px;
}
.modal-msg {
  font-size: .9rem;
  color: var(--text2);
  line-height: 1.6;
  margin: 0;
}
.modal-ft {
  padding: 0 20px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.modal-enter-active, .modal-leave-active {
  transition: opacity .25s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-box {
  animation: modal-in .3s cubic-bezier(.4,0,.2,1);
}
.modal-leave-active .modal-box {
  animation: modal-out .2s cubic-bezier(.4,0,.2,1) forwards;
}
@keyframes modal-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(.95) translateY(-10px); }
}

/* 加载动画 */
.loading-dots::after {
  content: '.' attr(data-dots, '');
  animation: dots 1.4s infinite;
}
@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

/* 响应式 */
@media (max-width:768px) {
  .adm-sb { position:fixed; z-index:200; height:100vh; }
  .adm-main-wrap { margin-left:60px; }
  .adm-sb:not(.collapsed) { width:220px; box-shadow:4px 0 20px rgba(0,0,0,.3); }
  .topbar-stats { display:none; }
  .adm-content { padding:14px; }
  .form-grid { grid-template-columns:1fr; }
}

/* 拖拽排序 */
.drag-handle {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
.site-row.dragging {
  opacity: 0.5;
}
</style>
