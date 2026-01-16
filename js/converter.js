// 初始化Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
    }
});

// Tab切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// 渲染Mermaid图表
async function renderMermaid() {
    const input = document.getElementById('mermaid-input').value;
    const previewArea = document.getElementById('preview-area');
    
    if (!input.trim()) {
        alert('请输入Mermaid代码');
        return;
    }
    
    try {
        previewArea.innerHTML = '<div class="mermaid-container"><div class="mermaid">' + input + '</div></div>';
        await mermaid.run({
            querySelector: '.mermaid'
        });
    } catch (error) {
        previewArea.innerHTML = `<div class="error">
            <p style="color: red;">❌ 渲染失败</p>
            <p style="color: #666; font-size: 0.9rem;">${error.message}</p>
        </div>`;
    }
}

// SVG文件上传
const uploadArea = document.getElementById('upload-area');
const svgUpload = document.getElementById('svg-upload');

uploadArea.addEventListener('click', () => {
    svgUpload.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'image/svg+xml') {
        loadSVGFile(file);
    } else {
        alert('请上传SVG文件');
    }
});

svgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        loadSVGFile(file);
    }
});

function loadSVGFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewArea = document.getElementById('preview-area');
        previewArea.innerHTML = `<div class="svg-container">${e.target.result}</div>`;
    };
    reader.readAsText(file);
}

// 导出PNG
async function exportToPNG() {
    const previewArea = document.getElementById('preview-area');
    const scale = parseInt(document.getElementById('scale-select').value);
    
    if (previewArea.querySelector('.placeholder')) {
        alert('请先渲染图表或上传SVG文件');
        return;
    }
    
    try {
        const canvas = await html2canvas(previewArea, {
            backgroundColor: '#ffffff',
            scale: scale,
            logging: false,
            useCORS: true
        });
        
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `diagram-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('✅ PNG导出成功！');
    } catch (error) {
        alert('导出失败: ' + error.message);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 页面加载时自动渲染示例
window.addEventListener('load', () => {
    renderMermaid();
});