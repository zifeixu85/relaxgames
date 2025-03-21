const fs = require('fs');
const path = require('path');

/**
 * 根据模板和JSON数据创建一个新的游戏页面
 * @param {Object} gameData - 游戏数据对象
 */
function createGamePage(gameData) {
    try {
        // 读取模板文件
        const templatePath = path.join(__dirname, 'game-template.html');
        let templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // 确保games目录存在
        const gamesDir = path.join(__dirname, 'games');
        if (!fs.existsSync(gamesDir)) {
            fs.mkdirSync(gamesDir);
        }
        
        // 替换所有变量
        for (const [key, value] of Object.entries(gameData)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            templateContent = templateContent.replace(regex, value);
        }
        
        // 生成新的文件路径
        const newFilePath = path.join(gamesDir, `${gameData.GAME_SLUG}.html`);
        
        // 写入新文件
        fs.writeFileSync(newFilePath, templateContent);
        
        console.log(`成功创建游戏页面: ${newFilePath}`);
        return true;
    } catch (error) {
        console.error('创建游戏页面时出错:', error);
        return false;
    }
}

/**
 * 从命令行参数读取JSON文件路径，并创建游戏页面
 */
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('用法: node create-game-page.js <game-data.json>');
        return;
    }
    
    const jsonPath = path.resolve(args[0]);
    
    try {
        // 读取并解析JSON文件
        const gameData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // 验证必要的字段
        const requiredFields = ['GAME_NAME', 'GAME_SLUG', 'GAME_TYPE', 'GAME_SHORT_DESCRIPTION', 'GAME_IFRAME_URL'];
        const missingFields = requiredFields.filter(field => !gameData[field]);
        
        if (missingFields.length > 0) {
            console.error(`错误: JSON数据缺少必要字段: ${missingFields.join(', ')}`);
            return;
        }
        
        // 创建游戏页面
        if (createGamePage(gameData)) {
            console.log('请运行 npm run build 以应用头部和尾部到新创建的游戏页面。');
        }
    } catch (error) {
        console.error('读取或解析JSON文件时出错:', error);
    }
}

// 当直接运行此脚本时执行main函数
if (require.main === module) {
    main();
} else {
    // 导出函数以便于测试或在其他脚本中使用
    module.exports = {
        createGamePage
    };
} 