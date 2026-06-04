# Xqvyrz

极简、快速、智能的搜索引擎主页。

## 技术栈

- **Next.js** 16.2.0
- **React** 18
- **TypeScript**
- **Tailwind CSS**

## 功能

- 每日自动更换壁纸
- 实时时钟显示
- 搜索联想（搜狗/360）
- 快捷链接（图片、视频、地图、新闻、翻译）
- 深色毛玻璃 UI
- HTTPS 本地开发支持

## 开始使用

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务
pnpm start
```

## 项目结构

```
app/
  api/suggestions/   # 搜索联想 API
  page.tsx           # 主页
  layout.tsx         # 根布局
server.js           # 自定义 HTTPS 服务器
```

## 开发说明

本项目使用 mkcert 生成的本地 HTTPS 证书进行安全开发。

## 作者

Ruanftrix (阮铭泽)
support@ruanftrix.cn
