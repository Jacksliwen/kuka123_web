# MY 导航 - 个人网址导航站

参考 kuka123.cool 风格的 Vue 3 个人网址导航项目。

## 快速启动

```bash
cd nav-site
npm install
npm run dev
```

访问 http://localhost:5173 即可查看效果。

## 功能特性

- 🔍 实时搜索过滤网站，回车直接百度搜索
- 🌙 深色 / 浅色主题一键切换
- 📂 六大分类：AI工具、开发工具、设计资源、学习角、效率工具、资讯
- 📱 响应式布局，移动端适配

## 添加/修改网站

编辑 `src/data/sites.js`，按如下格式添加：

```js
{ name: '网站名称', url: 'https://example.com', desc: '网站简介', icon: '🔗' }
```

## 项目结构

```
nav-site/
├── src/
│   ├── components/
│   │   ├── SiteCard.vue     # 网站卡片
│   │   └── SearchBar.vue    # 搜索栏
│   ├── data/
│   │   └── sites.js         # 网站数据（在这里添加网站）
│   ├── App.vue              # 主页面
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```
