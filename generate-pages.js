/**
 * 静态网站生成脚本 - 使用Handlebars模板引擎
 * 这个脚本读取游戏数据和模板，生成静态HTML页面，取代之前使用build.js的方法
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// 注册Handlebars助手
Handlebars.registerHelper('default', function(value, defaultValue) {
    return value || defaultValue;
});

// 读取组件内容并注册为部分模板
function registerPartials() {
    // 组件目录
    const componentsDir = path.join(__dirname, '_includes/components');
    const components = fs.readdirSync(componentsDir);
    
    // 注册每个组件为部分模板
    components.forEach(component => {
        if (component.endsWith('.html')) {
            const componentName = component.replace('.html', '');
            const componentPath = path.join(componentsDir, component);
            const componentContent = fs.readFileSync(componentPath, 'utf8');
            Handlebars.registerPartial(`components/${componentName}`, componentContent);
        }
    });
    
    console.log(`✅ 已注册 ${components.length} 个组件`);
}

// 读取游戏数据
function loadGameData() {
    const dataPath = path.join(__dirname, '_data/games.json');
    try {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('读取游戏数据失败:', error);
        return [];
    }
}

// 读取并编译模板
function compileTemplate() {
    const templatePath = path.join(__dirname, '_includes/layouts/game.html');
    try {
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        return Handlebars.compile(templateSource);
    } catch (error) {
        console.error('编译模板失败:', error);
        return null;
    }
}

// 生成游戏页面
function generateGamePages(template, games) {
    // 确保游戏页面目录存在
    const gamesDir = path.join(__dirname, 'games');
    if (!fs.existsSync(gamesDir)) {
        fs.mkdirSync(gamesDir);
    }
    
    // 为每个游戏生成页面
    games.forEach(game => {
        try {
            // 使用模板生成HTML内容
            const html = template(game);
            
            // 写入HTML文件
            const outputPath = path.join(gamesDir, `${game.slug}.html`);
            fs.writeFileSync(outputPath, html);
            
            console.log(`✅ 已生成: ${game.slug}.html`);
        } catch (error) {
            console.error(`❌ 生成 ${game.slug}.html 失败:`, error);
        }
    });
}

// 主函数
function main() {
    console.log('🚀 开始生成页面...');
    
    // 注册部分模板
    registerPartials();
    
    // 加载游戏数据
    const games = loadGameData();
    console.log(`📊 已加载 ${games.length} 个游戏数据`);
    
    // 编译模板
    const template = compileTemplate();
    if (!template) {
        console.error('❌ 模板编译失败，无法继续');
        return;
    }
    
    // 生成页面
    generateGamePages(template, games);
    
    console.log('✨ 页面生成完成!');
}

// 执行主函数
main(); 