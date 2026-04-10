<template>
  <div class="login-wrap">
    <!-- 背景粒子装饰 -->
    <div class="login-bg" aria-hidden="true">
      <div class="bg-circle c1"></div>
      <div class="bg-circle c2"></div>
      <div class="bg-circle c3"></div>
    </div>

    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
          <defs><linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
            <stop stop-color="#60a5fa"/><stop offset="1" stop-color="#2563eb"/>
          </linearGradient></defs>
          <rect width="40" height="40" rx="10" fill="url(#lg)"/>
          <path d="M13 11v18M13 20l8-9M13 20l9 9" stroke="white" stroke-width="2.6"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>
          <div class="login-site-name">KUKA<em>123</em></div>
          <div class="login-site-sub">后台管理系统</div>
        </div>
      </div>

      <h1 class="login-title">管理员登录</h1>
      <p class="login-desc">请输入管理员账号和密码</p>

      <!-- 错误提示 -->
      <div class="login-error" v-if="errMsg">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="6.5" stroke="#ef4444" stroke-width="1.5"/>
          <path d="M7.5 4.5v4M7.5 10.5v.5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ errMsg }}
      </div>

      <!-- 表单 -->
      <div class="login-form">
        <div class="lf-group">
          <label>账号</label>
          <div class="lf-input-wrap" :class="{focus: focusUser}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.4"/>
              <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <input
              v-model="username" type="text" placeholder="请输入账号"
              @focus="focusUser=true" @blur="focusUser=false"
              @keyup.enter="doLogin" autocomplete="username"/>
          </div>
        </div>

        <div class="lf-group">
          <label>密码</label>
          <div class="lf-input-wrap" :class="{focus: focusPwd}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="7" width="11" height="7.5" rx="2" stroke="currentColor" stroke-width="1.4"/>
              <path d="M5 7V5.5a3 3 0 016 0V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <input
              v-model="password" :type="showPwd?'text':'password'" placeholder="请输入密码"
              @focus="focusPwd=true" @blur="focusPwd=false"
              @keyup.enter="doLogin" autocomplete="current-password"/>
            <button class="lf-eye" @click="showPwd=!showPwd" type="button" tabindex="-1">
              <svg v-if="!showPwd" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.4"/>
                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M6.5 6.7a2 2 0 002.8 2.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                <path d="M4.2 4.4C2.7 5.4 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.4-2 2.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <button class="login-btn" @click="doLogin" :class="{loading}" :disabled="loading">
          <span v-if="!loading">登 录</span>
          <span v-else class="spin">⟳</span>
        </button>
      </div>

      <p class="login-foot">© 2023–2026 KUKA 导航 · 仅限管理员使用</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router   = useRouter()
const username = ref('')
const password = ref('')
const errMsg   = ref('')
const loading  = ref(false)
const showPwd  = ref(false)
const focusUser = ref(false)
const focusPwd  = ref(false)

async function doLogin() {
  errMsg.value = ''
  if (!username.value.trim()) { errMsg.value = '请输入账号'; return }
  if (!password.value)        { errMsg.value = '请输入密码'; return }

  loading.value = true
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: username.value, 
        password: password.value 
      })
    })
    
    const data = await res.json()
    
    if (res.ok && data.ok) {
      sessionStorage.setItem('kuka_admin_auth', data.token)
      router.push('/admin')
    } else {
      errMsg.value = data.error || '账号或密码错误，请重试'
      password.value = ''
    }
  } catch (err) {
    errMsg.value = '登录失败，请检查网络连接'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

.login-wrap {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #0a0e27 0%, #0d1f6b 50%, #1a3a8f 100%);
  font-family: 'PingFang SC','Microsoft YaHei',Arial,sans-serif;
  position: relative; overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* 背景装饰圆 */
.login-bg { position:absolute; inset:0; pointer-events:none; }
.bg-circle {
  position: absolute; border-radius: 50%;
  filter: blur(60px);
}
.c1 { width:400px; height:400px; top:-80px; left:-80px;
      background:radial-gradient(circle, rgba(96,165,250,.3), transparent 70%); }
.c2 { width:500px; height:500px; bottom:-120px; right:-100px;
      background:radial-gradient(circle, rgba(129,140,248,.25), transparent 70%); }
.c3 { width:300px; height:300px; top:40%; left:55%;
      background:radial-gradient(circle, rgba(56,189,248,.2), transparent 70%); }

/* 卡片 */
.login-card {
  position: relative; z-index: 2;
  width: 100%; max-width: 420px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 20px;
  padding: 40px 36px 32px;
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 64px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.05);
}

/* Logo */
.login-logo {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 28px;
}
.login-site-name {
  font-size: 1.3rem; font-weight: 900; color: #fff; letter-spacing: -.02em;
}
.login-site-name em { font-style:normal; color:#60a5fa; }
.login-site-sub { font-size:.72rem; color:#93c5fd; margin-top:2px; letter-spacing:.04em; }

.login-title {
  font-size: 1.4rem; font-weight: 800; color: #fff;
  letter-spacing: -.02em; margin-bottom: 6px;
}
.login-desc { font-size:.82rem; color:#93c5fd; margin-bottom:24px; }

/* 错误提示 */
.login-error {
  display: flex; align-items: center; gap: 7px;
  background: rgba(239,68,68,.12);
  border: 1px solid rgba(239,68,68,.3);
  color: #fca5a5; font-size:.82rem;
  padding: 9px 12px; border-radius: 9px;
  margin-bottom: 16px;
}

/* 表单 */
.login-form { display:flex; flex-direction:column; gap:16px; }
.lf-group { display:flex; flex-direction:column; gap:6px; }
.lf-group label { font-size:.78rem; font-weight:600; color:#bfdbfe; letter-spacing:.03em; }

.lf-input-wrap {
  display: flex; align-items: center; gap: 10px;
  height: 46px; padding: 0 14px;
  background: rgba(255,255,255,.07);
  border: 1.5px solid rgba(255,255,255,.12);
  border-radius: 11px;
  color: #93c5fd;
  transition: border-color .18s, background .18s, box-shadow .18s;
}
.lf-input-wrap.focus {
  border-color: #60a5fa;
  background: rgba(96,165,250,.08);
  box-shadow: 0 0 0 3px rgba(96,165,250,.15);
  color: #60a5fa;
}
.lf-input-wrap input {
  flex: 1; border:none; outline:none; background:transparent;
  font-size:.9rem; color:#e0f2fe; font-family:inherit;
}
.lf-input-wrap input::placeholder { color:#4b73a8; }

.lf-eye {
  background:none; border:none; cursor:pointer;
  color:#4b73a8; display:flex; align-items:center;
  padding:2px; transition:color .15s;
}
.lf-eye:hover { color:#93c5fd; }

/* 登录按钮 */
.login-btn {
  height: 48px; border:none; border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff; font-size:.96rem; font-weight:700;
  font-family:inherit; cursor:pointer; margin-top:6px;
  box-shadow: 0 4px 20px rgba(37,99,235,.45);
  transition: opacity .2s, transform .15s, box-shadow .2s;
  letter-spacing:.06em;
}
.login-btn:hover:not(:disabled) {
  opacity:.92; transform:translateY(-1px);
  box-shadow:0 6px 28px rgba(37,99,235,.6);
}
.login-btn:active:not(:disabled) { transform:translateY(0); }
.login-btn:disabled { opacity:.6; cursor:not-allowed; }
.login-btn.loading { background:linear-gradient(135deg,#3b82f6,#2563eb); }

.spin { display:inline-block; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.login-foot {
  text-align:center; margin-top:24px;
  font-size:.68rem; color:#4b73a8;
}
</style>
