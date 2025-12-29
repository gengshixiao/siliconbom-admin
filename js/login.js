/* 登录页面脚本 */

document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已登录
  if (sessionStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'main.html';
  }

  // 登录表单提交
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // 固定账号密码：admin / admin123
    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'main.html';
    } else {
      errorMessage.classList.add('show');
      setTimeout(() => {
        errorMessage.classList.remove('show');
      }, 3000);
    }
  });
});

