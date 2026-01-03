/* 登录页面脚本 */

document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已登录
  if (sessionStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'main.html';
  }

  const tokenInput = document.getElementById('token');
  const getTokenBtn = document.getElementById('getTokenBtn');
  let countdownTimer = null;
  let countdownSeconds = 0;

  // 预填充一个可用的令牌（6位数字）
  const validToken = '258851';
  tokenInput.value = validToken;

  // 生成新的令牌（纯前端模拟）
  function generateToken() {
    // 生成6位随机数字
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 开始倒计时
  function startCountdown(seconds) {
    countdownSeconds = seconds;
    getTokenBtn.disabled = true;
    
    function updateCountdown() {
      if (countdownSeconds > 0) {
        getTokenBtn.textContent = `${countdownSeconds}秒后重试`;
        countdownSeconds--;
        countdownTimer = setTimeout(updateCountdown, 1000);
      } else {
        getTokenBtn.disabled = false;
        getTokenBtn.textContent = '获取令牌';
        countdownTimer = null;
      }
    }
    
    updateCountdown();
  }

  // 获取令牌按钮点击事件
  getTokenBtn.addEventListener('click', function() {
    if (countdownTimer) return; // 如果正在倒计时，不执行
    
    // 生成新令牌并填充
    const newToken = generateToken();
    tokenInput.value = newToken;
    
    // 开始60秒倒计时
    startCountdown(60);
  });

  // 登录表单提交
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const token = document.getElementById('token').value;
    const errorMessage = document.getElementById('errorMessage');

    // 固定账号密码：admin / admin123，令牌验证（接受预填充的令牌或新生成的令牌）
    if (username === 'admin' && password === 'admin123' && token && token.length === 6) {
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

