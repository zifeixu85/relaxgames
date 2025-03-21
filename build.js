const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 读取组件内容
const headerContent = fs.readFileSync(path.join(__dirname, 'components/header.html'), 'utf8');
const footerContent = fs.readFileSync(path.join(__dirname, 'components/footer.html'), 'utf8');

// 基础样式引用
const baseStyles = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>`;

// Tailwind 配置
const tailwindConfig = `<script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        apple: {
                            blue: '#007AFF',
                            indigo: '#5856D6',
                            purple: '#AF52DE',
                            pink: '#FF2D55',
                            red: '#FF3B30',
                            orange: '#FF9500',
                            yellow: '#FFCC00',
                            green: '#34C759',
                            mint: '#00C7BE',
                            teal: '#5AC8FA',
                            cyan: '#32ADE6',
                            gray: '#8E8E93',
                            lightgray: '#F2F2F7',
                        }
                    },
                    fontFamily: {
                        'montserrat': ['Montserrat', 'sans-serif'],
                    },
                }
            }
        }
    </script>`;

// 自定义样式
const customStyles = `<style type="text/css">
        body {
            font-family: 'Montserrat', sans-serif;
        }
        .game-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .game-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .social-icon {
            transition: transform 0.2s ease;
        }
        .social-icon:hover {
            transform: scale(1.2);
        }
        .game-iframe-container {
            position: relative;
            overflow: hidden;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }
        .game-iframe-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
        @media (max-width: 768px) {
            .game-iframe-container {
                padding-top: 75%; /* Adjust for mobile */
            }
        }
    </style>`;

// Google Analytics 代码
const gaCode = `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-17YVC1EZF4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-17YVC1EZF4');
    </script>`;

// Favicon 代码
const faviconCode = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23FF2D55'/><stop offset='100%' style='stop-color:%23007AFF'/></linearGradient></defs><rect width='100' height='100' rx='20' fill='url(%23grad)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='bold' font-size='45' fill='white'>RG</text></svg>">`;

// 要处理的文件列表
const files = [
    'index.html',
    'games/candy-bubble.html',
    'games/cat-doctor.html',
    'games/idle-restaurant.html',
    'games/lol-surprise.html',
    'games/owl-and-rabbit-fashion.html',
    'games/pets-beauty-salon.html',
    'games/shopping-mania.html',
    'games/tile-match.html',
    'games/weird-dance.html',
    'privacy-policy.html',
    '404.html'
];

// 检查是否是开发模式
const isDev = process.argv.includes('--dev');
const isBuild = process.argv.includes('--build');

// 使用命令行参数处理文件
files.forEach(file => {
    try {
        const filePath = path.join(__dirname, file);
        
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            console.warn(`文件 ${file} 不存在，已跳过处理`);
            return;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 创建 DOM 对象
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        if (isDev) {
            // 开发模式 - 简化 HTML
            
            // 清理 header
            const headerElements = document.querySelectorAll('header');
            headerElements.forEach(header => {
                const comment = document.createComment(' Header ');
                header.parentNode.insertBefore(comment, header);
                
                const endComment = document.createComment(' End Header ');
                header.parentNode.insertBefore(endComment, header.nextSibling);
                
                header.parentNode.removeChild(header);
            });
            
            // 清理 footer
            const footerElements = document.querySelectorAll('footer');
            footerElements.forEach(footer => {
                const comment = document.createComment(' Footer ');
                footer.parentNode.insertBefore(comment, footer);
                
                const endComment = document.createComment(' End Footer ');
                footer.parentNode.insertBefore(endComment, footer.nextSibling);
                
                footer.parentNode.removeChild(footer);
            });
            
            // 清理 head 中的特定元素
            const head = document.querySelector('head');
            if (head) {
                // 清理所有 script 标签
                const scripts = head.querySelectorAll('script');
                scripts.forEach(script => script.parentNode.removeChild(script));
                
                // 清理所有 style 标签
                const styles = head.querySelectorAll('style');
                styles.forEach(style => style.parentNode.removeChild(style));
                
                // 清理除了元数据外的 link 标签
                const links = head.querySelectorAll('link:not([rel="canonical"])');
                links.forEach(link => {
                    if (link.getAttribute('rel') !== 'stylesheet' || 
                        !link.getAttribute('href')?.includes('styles.css')) {
                        link.parentNode.removeChild(link);
                    }
                });
                
                // 添加样式引用
                const stylesPath = file.startsWith('games/') ? '../styles.css' : './styles.css';
                const existingStylesheets = head.querySelectorAll(`link[href="${stylesPath}"]`);
                
                if (existingStylesheets.length === 0) {
                    const styleLink = document.createElement('link');
                    styleLink.setAttribute('rel', 'stylesheet');
                    styleLink.setAttribute('href', stylesPath);
                    head.appendChild(styleLink);
                }
            }
        } else if (isBuild) {
            // 生产模式 - 完全重建 HTML 结构
            
            // 提取 head 中的元数据
            const head = document.querySelector('head');
            const metaTags = [];
            
            if (head) {
                // 提取 meta 标签
                const metas = head.querySelectorAll('meta');
                metas.forEach(meta => metaTags.push(meta.outerHTML));
                
                // 提取 title 标签
                const title = head.querySelector('title');
                if (title) metaTags.push(title.outerHTML);
                
                // 提取 canonical 链接
                const canonical = head.querySelector('link[rel="canonical"]');
                if (canonical) metaTags.push(canonical.outerHTML);
                
                // 清空 head
                while (head.firstChild) {
                    head.removeChild(head.firstChild);
                }
                
                // 重建 head 内容
                // 添加元数据
                metaTags.forEach(tag => {
                    head.innerHTML += tag + '\n    ';
                });
                
                // 添加样式和脚本
                const stylesPath = file.startsWith('games/') ? '../styles.css' : './styles.css';
                head.innerHTML += '\n    ' + baseStyles + '\n    ' + 
                                tailwindConfig + '\n    ' + 
                                customStyles + '\n    ' + 
                                `<link rel="stylesheet" href="${stylesPath}">`;
                
                // 正确添加Google Analytics代码
                const gaScriptExternal = document.createElement('script');
                gaScriptExternal.setAttribute('async', '');
                gaScriptExternal.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-17YVC1EZF4');
                head.appendChild(gaScriptExternal);
                
                const gaScriptInline = document.createElement('script');
                gaScriptInline.textContent = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-17YVC1EZF4');
                `;
                head.appendChild(gaScriptInline);
                
                // 添加Favicon
                const faviconLink = document.createElement('link');
                faviconLink.setAttribute('rel', 'icon');
                faviconLink.setAttribute('href', 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><linearGradient id=\'grad\' x1=\'0%\' y1=\'0%\' x2=\'100%\' y2=\'100%\'><stop offset=\'0%\' style=\'stop-color:%23FF2D55\'/><stop offset=\'100%\' style=\'stop-color:%23007AFF\'/></linearGradient></defs><rect width=\'100\' height=\'100\' rx=\'20\' fill=\'url(%23grad)\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'Arial, sans-serif\' font-weight=\'bold\' font-size=\'45\' fill=\'white\'>RG</text></svg>');
                head.appendChild(faviconLink);
            }
            
            // 确保 body 存在
            const body = document.querySelector('body');
            if (!body) {
                console.error(`文件 ${file} 中没有找到 body 标签`);
                return;
            }
            
            console.log(`Updating ${file} with header and footer...`);
            
            try {
                // 创建一个临时 div 来转换 HTML 字符串为 DOM 元素
                const tempHeaderDiv = document.createElement('div');
                tempHeaderDiv.innerHTML = headerContent;
                
                const tempFooterDiv = document.createElement('div');
                tempFooterDiv.innerHTML = footerContent;
                
                // 获取 header 和 footer 元素
                const header = tempHeaderDiv.querySelector('header');
                if (!header) {
                    console.error('Header element not found in header content');
                    return;
                }
                
                const footer = tempFooterDiv.querySelector('footer');
                if (!footer) {
                    console.error('Footer element not found in footer content');
                    return;
                }
                
                // 先移除现有的 header 和 footer 元素
                const existingHeaders = body.querySelectorAll('header');
                existingHeaders.forEach(el => el.parentNode.removeChild(el));
                
                const existingFooters = body.querySelectorAll('footer');
                existingFooters.forEach(el => el.parentNode.removeChild(el));
                
                // 处理注释的替代方法 - 不修改DOM结构，而是使用克隆和重建的方式
                const clone = body.cloneNode(true);
                const commentRegex = /<!--[\s\S]*?-->/g;
                const childNodes = Array.from(clone.childNodes);
                
                // 创建新的body元素
                const newBody = document.createElement('body');
                
                // 复制body的属性
                for (let i = 0; i < body.attributes.length; i++) {
                    const attr = body.attributes[i];
                    newBody.setAttribute(attr.name, attr.value);
                }
                
                // 确保所有页面都有相同的背景类
                // 如果现有body没有这些类，就添加上
                const backgroundClasses = ['bg-apple-lightgray', 'text-gray-800', 'bg-feminine-gradient', 'bg-decorative'];
                
                // 获取当前class属性
                let currentClasses = newBody.getAttribute('class') || '';
                const classArray = currentClasses.split(' ').filter(c => c.trim() !== '');
                
                // 添加缺少的背景类
                backgroundClasses.forEach(cls => {
                    if (!classArray.includes(cls)) {
                        classArray.push(cls);
                    }
                });
                
                // 更新class属性
                newBody.setAttribute('class', classArray.join(' '));
                
                // 添加header
                newBody.appendChild(header);
                
                // 添加所有子节点，忽略注释
                childNodes.forEach(node => {
                    // 跳过注释节点
                    if (node.nodeType === 8) {
                        const commentText = node.nodeValue;
                        if (commentText.includes('Header') || commentText.includes('Footer')) {
                            return; // 跳过header和footer相关的注释
                        }
                    }
                    
                    // 如果是元素节点，检查是否是header或footer
                    if (node.nodeType === 1) {
                        if (node.nodeName.toLowerCase() === 'header' || 
                            node.nodeName.toLowerCase() === 'footer') {
                            return; // 跳过header和footer元素
                        }
                    }
                    
                    // 添加其他节点
                    newBody.appendChild(node.cloneNode(true));
                });
                
                // 添加footer
                newBody.appendChild(footer);
                
                // 替换原始的body
                body.parentNode.replaceChild(newBody, body);
                
                console.log(`Successfully updated ${file} with header and footer`);
            } catch (error) {
                console.error(`Error updating ${file}:`, error);
            }
        }
        
        // 序列化并保存 HTML
        const serialized = dom.serialize();
        fs.writeFileSync(filePath, serialized);
        console.log(`Updated ${file}`);
    } catch (error) {
        console.error(`处理文件 ${file} 时出错:`, error);
    }
}); 