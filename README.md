# 鬼王作对

横屏微信小程序 + Node.js WebSocket 对战服务。

---

## 项目结构

### 小程序端（本工程）

- `app.js`：小程序入口
- `app.json`：全局配置（页面、横竖屏等）
- `pages/index/index.wxml`：主界面结构
- `pages/index/index.wxss`：主界面样式
- `pages/index/index.js`：主页面交互逻辑
- `utils/game.js`：WebSocket 客户端通信
- `utils/rules.js`：牌型识别与比牌逻辑
- `utils/poker.js`：牌组与洗牌逻辑

### 服务端（独立 Node 目录）

典型文件：

- `server.js`
- `poker.js`
- `rules.js`
- `package.json`
- `public/`

---

## 技术栈

- 小程序：原生微信小程序（WXML / WXSS / JS）
- 服务端：Node.js + Express + ws（或同类 WebSocket 实现）

---

## 本地开发

### 1) 启动服务端

```bash
npm install
node server.js
```

默认监听 `3000` 端口（按服务端代码为准）。

### 2) 小程序连接地址

在 `utils/game.js` 中配置：

```js
const url = 'wss://your-domain-or-ip';
```

联调时可改为可访问的 `ws://` 地址；发布建议使用 `wss://`。

### 3) 打开小程序工程

使用微信开发者工具打开工程根目录，编译运行即可。

---

## 对战规则说明（当前实现）

基础牌型包含：

- 单张、对子、三张
- 三带一、三带二
- 顺子、连对
- 炸弹、王炸、510K（杂色/同花）
- 飞机（连三张）

### 飞机带牌

- 两连三（如 `333444` / `666777`）支持带 `0~4` 张
- 三连三（如 `333444555`）支持带 `0~6` 张
- 飞机对压需同连数、同带牌张数，再比较主体大小

---

## 部署建议（Nginx / 面板）

1. 上传服务端代码与依赖文件
2. 安装依赖并启动进程（建议 PM2 守护）
3. 反向代理到 Node 端口（如 `127.0.0.1:3000`）
4. 开启 WebSocket Upgrade 转发
5. 配置 HTTPS / WSS 证书

---

## 常见问题

### 小程序连不上

- 检查 `utils/game.js` 里的地址与协议
- 检查域名证书与反向代理配置
- 检查服务端进程是否运行

### 牌能选但不能出

- 确认前后端 `rules.js` 逻辑一致
- 清理开发者工具缓存并重启

### 样式出现遮挡

- 检查 `pages/index/index.wxss` 是否被旧文件覆盖
- 检查 `z-index` 与 `position` 的联动关系

---

## 安全建议

- 不要在代码中硬编码账号、口令、Token
- 使用环境变量管理敏感配置
- 服务端日志与关键文件定期备份
