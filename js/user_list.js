/* 用户列表页面特定脚本 */

// 模拟数据（第一页10条）
const mockUsers = [
  { id: 'U001', username: '张三', phone: '138****1234', registerTime: '2024-12-01 10:30', lastLogin: '2025-01-15 14:20', sessions: 156, tokens: 1248000 },
  { id: 'U002', username: '李四', phone: '139****5678', registerTime: '2024-11-25 09:15', lastLogin: '2025-01-15 16:45', sessions: 203, tokens: 1892000 },
  { id: 'U003', username: '王五', phone: '150****9012', registerTime: '2024-12-10 11:20', lastLogin: '2025-01-15 13:10', sessions: 89, tokens: 678000 },
  { id: 'U004', username: '赵六', phone: '186****3456', registerTime: '2024-11-18 14:50', lastLogin: '2025-01-15 15:30', sessions: 312, tokens: 2456000 },
  { id: 'U005', username: '钱七', phone: '177****7890', registerTime: '2024-12-05 08:40', lastLogin: '2025-01-15 12:00', sessions: 124, tokens: 987000 },
  { id: 'U006', username: '孙八', phone: '188****2345', registerTime: '2024-11-28 16:25', lastLogin: '2025-01-15 17:15', sessions: 267, tokens: 2134000 },
  { id: 'U007', username: '周九', phone: '199****6789', registerTime: '2024-12-12 10:10', lastLogin: '2025-01-15 11:45', sessions: 78, tokens: 567000 },
  { id: 'U008', username: '吴十', phone: '136****0123', registerTime: '2024-11-20 13:35', lastLogin: '2025-01-15 18:20', sessions: 189, tokens: 1456000 },
  { id: 'U009', username: '郑一', phone: '137****4567', registerTime: '2024-12-08 09:55', lastLogin: '2025-01-15 10:30', sessions: 145, tokens: 1123000 },
  { id: 'U010', username: '王二', phone: '158****8901', registerTime: '2024-11-30 15:20', lastLogin: '2025-01-15 19:00', sessions: 298, tokens: 2345000 }
];

let currentPage = 1;
let sortField = 'lastLogin';
let sortOrder = 'desc';
let filteredUsers = [...mockUsers];
let pagination;

document.addEventListener('DOMContentLoaded', function() {
  // 初始化分页
  pagination = new Pagination({
    currentPage: 1,
    pageSize: 10,
    totalItems: filteredUsers.length,
    onPageChange: (page) => {
      currentPage = page;
      renderTable();
    }
  });

  // 初始化搜索
  createSearchHandler('searchInput', (query) => {
    filteredUsers = mockUsers.filter(user => 
      user.id.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.phone.includes(query)
    );
    currentPage = 1;
    pagination.reset();
    pagination.setTotalItems(filteredUsers.length);
    renderTable();
  });

  // 初始化排序
  initTableSort('table', (field) => {
    sortTable(field);
  });

  // 默认按最近登录时间倒序
  sortTable('lastLogin');
});

function renderTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  const start = (currentPage - 1) * 10;
  const end = start + 10;
  const pageData = filteredUsers.slice(start, end);

  pageData.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.phone}</td>
      <td>${user.registerTime}</td>
      <td>${user.lastLogin}</td>
      <td>${user.sessions}</td>
      <td>${(user.tokens / 1000).toFixed(1)}K</td>
      <td><button class="btn-action" onclick="viewSessions('${user.id}', '${user.username}')">查看会话</button></td>
    `;
    tbody.appendChild(row);
  });

  updateSortIndicators(sortField, sortOrder);
}

function sortTable(field) {
  if (sortField === field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortOrder = 'desc';
  }

  filteredUsers.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    if (field === 'lastLogin' || field === 'registerTime') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  currentPage = 1;
  pagination.reset();
  renderTable();
}

function viewSessions(userId, username) {
  // 跳转到会话列表页面
  window.location.href = `session_list.html?userId=${encodeURIComponent(userId)}&username=${encodeURIComponent(username)}`;
}

