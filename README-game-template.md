# 游戏页面模板使用指南

这个工具包可以帮助你快速创建新的游戏页面，只需要提供游戏的关键信息，就能生成符合网站风格的完整HTML页面。

## 文件说明

1. `game-template.html` - 游戏页面的HTML模板
2. `game-template-sample.json` - 示例JSON数据文件，包含所有可替换变量的示例
3. `create-game-page.js` - 自动生成游戏页面的Node.js脚本

## 快速开始

### 步骤1: 创建游戏数据JSON文件

为你的新游戏创建一个JSON文件（例如：`my-new-game.json`），包含以下必要信息：

```json
{
  "GAME_NAME": "你的游戏名称",
  "GAME_TYPE": "游戏类型",
  "GAME_SLUG": "your-game-slug",
  "GAME_SHORT_DESCRIPTION": "简短的游戏描述",
  "GAME_IFRAME_URL": "游戏iframe的URL",
  "TAG_1": "标签1",
  "TAG_1_COLOR": "blue",
  "TAG_2": "标签2",
  "TAG_2_COLOR": "purple",
  "TAG_3": "标签3",
  "TAG_3_COLOR": "pink",
  "GAME_INTRO_TEXT": "游戏简介文本",
  "GAME_INSTRUCTIONS": "<li>指令1</li><li>指令2</li><li>指令3</li>",
  "GAME_CONTROLS_TEXT": "游戏控制说明",
  "RELATED_GAMES": "相关游戏HTML代码"
}
```

### 步骤2: 运行生成脚本

```bash
node create-game-page.js my-new-game.json
```

### 步骤3: 构建页面

生成HTML文件后，运行构建命令来添加网站的header和footer：

```bash
npm run build
```

## 变量说明

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| GAME_NAME | 游戏名称 | "Amazing Adventure" |
| GAME_TYPE | 游戏类型 | "Adventure" |
| GAME_SLUG | 用于URL的游戏名称（小写，用连字符） | "amazing-adventure" |
| GAME_SHORT_DESCRIPTION | 简短的游戏描述 | "Embark on an exciting journey..." |
| GAME_IFRAME_URL | 游戏iframe的URL | "https://example.com/games/..." |
| TAG_1, TAG_2, TAG_3 | 游戏标签 | "Adventure", "Magic", "Fun" |
| TAG_1_COLOR, TAG_2_COLOR, TAG_3_COLOR | 标签颜色 | "blue", "purple", "pink" |
| GAME_INTRO_TEXT | 游戏简介文本 | "Adventure awaits in this..." |
| GAME_INSTRUCTIONS | 游戏指令（HTML列表项） | "<li>Use arrow keys...</li>" |
| GAME_CONTROLS_TEXT | 控制说明 | "Use your keyboard..." |
| RELATED_GAMES | 相关游戏HTML代码 | "<!-- Related Game -->..." |

## 可用的颜色选项

这些颜色与网站的设计风格相匹配：

- `blue` - 蓝色 (#007AFF)
- `indigo` - 靛蓝色 (#5856D6)
- `purple` - 紫色 (#AF52DE)
- `pink` - 粉色 (#FF2D55)
- `red` - 红色 (#FF3B30)
- `orange` - 橙色 (#FF9500)
- `yellow` - 黄色 (#FFCC00)
- `green` - 绿色 (#34C759)
- `mint` - 薄荷色 (#00C7BE)
- `teal` - 青色 (#5AC8FA)
- `cyan` - 靛青色 (#32ADE6)

## 注意事项

1. 确保为每个新游戏准备一个对应尺寸的图片，并放在`/images/`目录下
2. 图片名称应与`GAME_SLUG`相同，例如：`/images/amazing-adventure.png`
3. 运行完`create-game-page.js`脚本后，别忘了执行`npm run build`来添加头部和尾部
4. 相关游戏部分的HTML可以从`game-template-sample.json`复制并修改

## 示例

查看`game-template-sample.json`文件，了解完整的示例数据。 