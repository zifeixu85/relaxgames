# RelaxGames.online

一个免费的在线游戏集合网站，提供各种休闲游戏。

## 开发

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

构建完成后，所有静态文件将生成在 `public/` 目录中。

## 部署

### Vercel 部署
项目已配置为在 Vercel 上自动部署：

1. 推送代码到 GitHub
2. Vercel 会自动检测并构建项目
3. 构建输出目录：`public/`

### 构建配置
- 输出目录：`public/`
- 构建命令：`npm run build`
- 静态文件服务

## 项目结构

```
├── _data/              # 游戏数据
├── _includes/          # 模板组件
├── games/              # 游戏页面（开发时）
├── images/             # 图片资源
├── public/             # 构建输出目录
├── generate-pages.js   # 页面生成脚本
└── vercel.json         # Vercel 配置
```

## 统计代码

网站已集成以下统计服务：
- Google Analytics
- Umami Analytics  
- Plausible Analytics

## 许可证

MIT License
