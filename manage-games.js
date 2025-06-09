/**
 * 游戏数据管理脚本
 * 提供交互式命令行界面，用于添加、编辑、删除游戏数据
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const dataPath = path.join(__dirname, '_data/games.json');

// 创建readline接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 读取游戏数据
function loadGameData() {
    try {
        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, 'utf8');
            return JSON.parse(rawData);
        }
        return [];
    } catch (error) {
        console.error('读取游戏数据失败:', error);
        return [];
    }
}

// 保存游戏数据
function saveGameData(games) {
    try {
        const dataDir = path.dirname(dataPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(dataPath, JSON.stringify(games, null, 2), 'utf8');
        console.log('✅ 游戏数据保存成功');
        return true;
    } catch (error) {
        console.error('❌ 保存游戏数据失败:', error);
        return false;
    }
}

// 显示所有游戏
function listGames(games) {
    console.log('\n游戏列表:');
    if (games.length === 0) {
        console.log('暂无游戏数据');
        return;
    }
    
    games.forEach((game, index) => {
        console.log(`${index + 1}. ${game.title} (${game.slug})`);
    });
    console.log('');
}

// 添加新游戏
function addGame(games) {
    console.log('\n添加新游戏\n');
    
    const game = {
        tags: [],
        instructions: [],
        relatedGames: []
    };
    
    // 基本信息
    rl.question('游戏名称: ', (answer) => {
        game.title = answer;
        game.id = answer.toLowerCase().replace(/\s+/g, '-');
        
        rl.question('URL别名 (小写，用连字符): ', (answer) => {
            game.slug = answer || game.id;
            game.imageSlug = game.slug;
            
            rl.question('游戏类型: ', (answer) => {
                game.gameType = answer;
                
                rl.question('主要颜色 (blue/pink/purple/etc): ', (answer) => {
                    game.primaryColor = answer || 'blue';
                    
                    rl.question('描述: ', (answer) => {
                        game.description = answer;
                        
                        rl.question('游戏iframe URL: ', (answer) => {
                            game.iframeUrl = answer;
                            
                            // 添加标签
                            addTags(game, () => {
                                // 添加指令
                                addInstructions(game, () => {
                                    // 添加相关游戏
                                    addRelatedGames(game, games, () => {
                                        // 添加游戏到数组
                                        games.push(game);
                                        if (saveGameData(games)) {
                                            console.log(`\n✅ 新游戏 "${game.title}" 添加成功\n`);
                                        }
                                        showMainMenu(games);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// 添加标签
function addTags(game, callback) {
    console.log('\n添加标签 (最多3个)\n');
    
    function promptTag(index) {
        if (index > 3) {
            callback();
            return;
        }
        
        rl.question(`标签 ${index} 名称 (回车跳过): `, (name) => {
            if (!name) {
                callback();
                return;
            }
            
            rl.question(`标签 ${index} 颜色: `, (color) => {
                game.tags.push({ name, color: color || 'blue' });
                promptTag(index + 1);
            });
        });
    }
    
    promptTag(1);
}

// 添加指令
function addInstructions(game, callback) {
    console.log('\n添加游戏指令\n');
    
    rl.question('游戏简介: ', (answer) => {
        game.introText = answer;
        
        function promptInstruction(index) {
            rl.question(`指令 ${index} (回车完成): `, (instruction) => {
                if (!instruction) {
                    rl.question('控制说明: ', (answer) => {
                        game.controlsText = answer;
                        callback();
                    });
                    return;
                }
                
                game.instructions.push(instruction);
                promptInstruction(index + 1);
            });
        }
        
        promptInstruction(1);
    });
}

// 添加相关游戏
function addRelatedGames(game, allGames, callback) {
    console.log('\n添加相关游戏 (最多4个)\n');
    
    // 显示可用游戏
    const availableGames = allGames.filter(g => g.id !== game.id);
    console.log('可用游戏:');
    availableGames.forEach((g, index) => {
        console.log(`${index + 1}. ${g.title}`);
    });
    
    function promptRelatedGame(index) {
        if (index > 4 || availableGames.length === 0) {
            callback();
            return;
        }
        
        rl.question(`相关游戏 ${index} 编号 (回车跳过): `, (answer) => {
            if (!answer) {
                callback();
                return;
            }
            
            const selectedIndex = parseInt(answer) - 1;
            if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= availableGames.length) {
                console.log('❌ 无效的游戏编号');
                promptRelatedGame(index);
                return;
            }
            
            const selectedGame = availableGames[selectedIndex];
            
            rl.question(`标签 (默认: ${selectedGame.gameType}): `, (tag) => {
                game.relatedGames.push({
                    title: selectedGame.title,
                    slug: selectedGame.slug,
                    imageSlug: selectedGame.imageSlug || selectedGame.slug,
                    tag: tag || selectedGame.gameType,
                    color: selectedGame.primaryColor || 'blue'
                });
                
                // 从可用游戏中移除已选游戏
                availableGames.splice(selectedIndex, 1);
                
                if (availableGames.length === 0) {
                    console.log('没有更多可用游戏');
                    callback();
                    return;
                }
                
                // 更新可用游戏显示
                console.log('\n可用游戏:');
                availableGames.forEach((g, index) => {
                    console.log(`${index + 1}. ${g.title}`);
                });
                
                promptRelatedGame(index + 1);
            });
        });
    }
    
    if (availableGames.length === 0) {
        console.log('没有可用的相关游戏');
        callback();
        return;
    }
    
    promptRelatedGame(1);
}

// 删除游戏
function deleteGame(games) {
    listGames(games);
    
    if (games.length === 0) {
        showMainMenu(games);
        return;
    }
    
    rl.question('要删除的游戏编号 (回车取消): ', (answer) => {
        if (!answer) {
            showMainMenu(games);
            return;
        }
        
        const index = parseInt(answer) - 1;
        if (isNaN(index) || index < 0 || index >= games.length) {
            console.log('❌ 无效的游戏编号');
            deleteGame(games);
            return;
        }
        
        const game = games[index];
        rl.question(`确认删除游戏 "${game.title}"? (y/n): `, (answer) => {
            if (answer.toLowerCase() === 'y') {
                games.splice(index, 1);
                if (saveGameData(games)) {
                    console.log(`\n✅ 游戏 "${game.title}" 已删除\n`);
                }
            }
            showMainMenu(games);
        });
    });
}

// 主菜单
function showMainMenu(games) {
    console.log('\n===== 游戏管理系统 =====');
    console.log('1. 查看所有游戏');
    console.log('2. 添加新游戏');
    console.log('3. 删除游戏');
    console.log('4. 退出');
    
    rl.question('\n请选择操作: ', (answer) => {
        switch (answer) {
            case '1':
                listGames(games);
                showMainMenu(games);
                break;
            case '2':
                addGame(games);
                break;
            case '3':
                deleteGame(games);
                break;
            case '4':
                console.log('再见!');
                rl.close();
                break;
            default:
                console.log('❌ 无效的选择');
                showMainMenu(games);
        }
    });
}

// 主函数
function main() {
    console.log('🎮 欢迎使用游戏管理系统');
    const games = loadGameData();
    showMainMenu(games);
}

// 执行主函数
main(); 