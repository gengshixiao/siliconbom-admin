/* 通用JavaScript函数 */

/**
 * 主题自动应用
 * 每个页面加载时自动读取并应用主题
 */
(function() {
  // 应用主题的函数
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
  
  // 立即执行，应用保存的主题
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  
  // 监听localStorage变化（用于跨标签页同步）
  window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
      const newTheme = e.newValue || 'dark';
      applyTheme(newTheme);
    }
  });
  
  // 监听父页面发来的主题切换消息（用于iframe）
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'themeChange') {
      applyTheme(e.data.theme);
    }
  });
})();

/**
 * 分页功能
 */
class Pagination {
  constructor(options) {
    this.currentPage = options.currentPage || 1;
    this.pageSize = options.pageSize || 10;
    this.totalItems = options.totalItems || 0;
    this.onPageChange = options.onPageChange || (() => {});
    this.prevBtnId = options.prevBtnId || 'prevBtn';
    this.nextBtnId = options.nextBtnId || 'nextBtn';
    this.pageInfoId = options.pageInfoId || 'pageInfo';
    
    this.init();
  }

  init() {
    const prevBtn = document.getElementById(this.prevBtnId);
    const nextBtn = document.getElementById(this.nextBtnId);
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.changePage(-1));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.changePage(1));
    }
    
    this.updatePagination();
  }

  changePage(delta) {
    const totalPages = this.getTotalPages();
    const newPage = this.currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
      this.currentPage = newPage;
      this.updatePagination();
      this.onPageChange(this.currentPage);
    }
  }

  getTotalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  updatePagination() {
    const totalPages = this.getTotalPages();
    const pageInfo = document.getElementById(this.pageInfoId);
    const prevBtn = document.getElementById(this.prevBtnId);
    const nextBtn = document.getElementById(this.nextBtnId);
    
    if (pageInfo) {
      pageInfo.textContent = `第 ${this.currentPage} 页，共 ${totalPages} 页`;
    }
    
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= totalPages;
    }
  }

  setTotalItems(total) {
    this.totalItems = total;
    this.updatePagination();
  }

  reset() {
    this.currentPage = 1;
    this.updatePagination();
  }
}

/**
 * 模态框功能
 */
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    if (!this.modal) return;
    
    this.init();
  }

  init() {
    // 点击背景关闭
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  show() {
    if (this.modal) {
      this.modal.classList.add('show');
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('show');
    }
  }

  toggle() {
    if (this.modal) {
      this.modal.classList.toggle('show');
    }
  }
}

/**
 * 搜索功能
 */
function createSearchHandler(searchInputId, onSearch) {
  const searchInput = document.getElementById(searchInputId);
  if (!searchInput) return;
  
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase();
      onSearch(query);
    }, 300); // 防抖300ms
  });
}

/**
 * 表格排序功能
 */
function initTableSort(tableSelector, onSort) {
  const table = document.querySelector(tableSelector);
  if (!table) return;
  
  const sortableHeaders = table.querySelectorAll('th.sortable');
  
  sortableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const field = th.getAttribute('data-sort');
      if (field) {
        onSort(field);
      }
    });
  });
}

/**
 * 更新排序指示器
 */
function updateSortIndicators(sortField, sortOrder) {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.getAttribute('data-sort') === sortField) {
      th.classList.add(sortOrder === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

/**
 * 工具函数：格式化数字
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * 工具函数：格式化日期
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

