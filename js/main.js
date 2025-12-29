/* 主布局页面脚本 */

// 检查登录状态
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'index.html';
}

// 页面标题映射
const pageTitles = {
  'dashboard_user.html': '用户运营看板',
  'dashboard_agent.html': '智能体运营看板',
  'dashboard_bom.html': 'BOM及知识库运营看板',
  'user_list.html': '用户列表',
  'user_feedback.html': '产品反馈'
};

// 导航切换
document.addEventListener('DOMContentLoaded', function() {
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
});

// 退出登录
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}

