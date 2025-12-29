/* 主布局页面脚本 */

// 检查登录状态
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'index.html';
}

// 页面标题映射
const pageTitles = {
  'dashboard_user.html': '用户运营',
  'dashboard_agent.html': '智能体运营',
  'dashboard_bom.html': 'BOM及知识库运营',
  'user_list.html': '用户列表',
  'user_feedback.html': '产品反馈'
};

// 应用主题
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// 通知iframe更新主题
function notifyIframeTheme(theme) {
  const iframe = document.getElementById('contentFrame');
  if (iframe && iframe.contentWindow) {
    // 使用postMessage通知iframe
    iframe.contentWindow.postMessage({ type: 'themeChange', theme: theme }, '*');
  }
}

// 主题切换功能
function initTheme() {
  // 从localStorage读取主题设置，默认为dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  // 应用主题到主页面
  applyTheme(savedTheme);
  
  // 更新图标
  if (savedTheme === 'light') {
    themeIcon.textContent = '☀️';
  } else {
    themeIcon.textContent = '🌙';
  }
  
  // 主题切换事件
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme;
    
    if (currentTheme === 'light') {
      // 切换到深色模式
      newTheme = 'dark';
      applyTheme('dark');
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    } else {
      // 切换到浅色模式
      newTheme = 'light';
      applyTheme('light');
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'light');
    }
    
    // 通知iframe更新主题
    notifyIframeTheme(newTheme);
  });
}

// 导航切换
document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题
  initTheme();
  
  // 侧边栏收起/展开功能
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarExpandBtn = document.getElementById('sidebarExpandBtn');
  
  // 从localStorage读取侧边栏状态（默认展开）
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    sidebarExpandBtn.classList.add('show');
  }
  
  // 收起按钮
  sidebarToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebar.classList.add('collapsed');
    sidebarExpandBtn.classList.add('show');
    localStorage.setItem('sidebarCollapsed', 'true');
  });
  
  // 展开按钮
  sidebarExpandBtn.addEventListener('click', function() {
    sidebar.classList.remove('collapsed');
    sidebarExpandBtn.classList.remove('show');
    localStorage.setItem('sidebarCollapsed', 'false');
  });
  
  // 导航项点击事件
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      const title = pageTitles[page] || this.textContent.trim();
      
      // 更新导航状态
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
      // 更新页面标题
      document.getElementById('pageTitle').textContent = title;
      
      // 加载页面
      document.getElementById('contentFrame').src = page;
    });
  });
  
  // 监听iframe加载完成，同步主题
  const contentFrame = document.getElementById('contentFrame');
  contentFrame.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    notifyIframeTheme(savedTheme);
  });
});

// 退出登录
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}

