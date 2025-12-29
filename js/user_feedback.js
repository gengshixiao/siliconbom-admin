/* 产品反馈页面特定脚本 */

// 模拟数据（第一页10条）
const mockFeedbacks = [
  {
    id: 'F001',
    phone: '138****1234',
    time: '2025-01-15 18:30',
    content: '希望可以支持批量导入BOM文件，现在一个一个上传太麻烦了。另外建议增加BOM版本对比功能，方便查看不同版本之间的差异。',
    images: ['screenshot1.png', 'screenshot2.png'],
    tags: ['物料数据不全', '功能bug']
  },
  {
    id: 'F002',
    phone: '139****5678',
    time: '2025-01-15 17:20',
    content: '智能体回答有时候不够准确，特别是涉及到技术参数的时候，建议加强知识库的准确性。',
    images: ['screenshot3.png'],
    tags: ['聊起来笨笨的']
  },
  {
    id: 'F003',
    phone: '150****9012',
    time: '2025-01-15 16:15',
    content: '界面响应速度有点慢，特别是在查询大量数据的时候，希望能优化一下性能。',
    images: [],
    tags: ['系统延迟/吐字慢']
  },
  {
    id: 'F004',
    phone: '186****3456',
    time: '2025-01-15 15:45',
    content: '建议增加导出功能，可以把对话记录导出为PDF或Word文档，方便保存和分享。',
    images: ['screenshot4.png'],
    tags: ['功能bug']
  },
  {
    id: 'F005',
    phone: '177****7890',
    time: '2025-01-15 14:30',
    content: '知识库搜索功能很好用，但是希望能支持更复杂的查询条件，比如按日期、类型等筛选。',
    images: ['screenshot5.png', 'screenshot6.png'],
    tags: ['物料数据不全']
  },
  {
    id: 'F006',
    phone: '188****2345',
    time: '2025-01-15 13:20',
    content: '有时候上传的文档解析不准确，特别是表格和图片内容，希望改进一下OCR识别能力。',
    images: ['screenshot7.png'],
    tags: ['功能bug', '物料数据不全']
  },
  {
    id: 'F007',
    phone: '199****6789',
    time: '2025-01-15 12:10',
    content: '建议增加多语言支持，我们团队有海外同事，希望能支持英文界面。',
    images: [],
    tags: ['功能bug']
  },
  {
    id: 'F008',
    phone: '136****0123',
    time: '2025-01-15 11:00',
    content: 'BOM管理功能很实用，但是希望能增加批量操作功能，比如批量删除、批量导出等。',
    images: ['screenshot8.png'],
    tags: ['功能bug']
  },
  {
    id: 'F009',
    phone: '137****4567',
    time: '2025-01-15 10:30',
    content: '智能体的回答有时候太啰嗦了，希望能更简洁直接一些，或者提供简洁模式和详细模式的选择。',
    images: ['screenshot9.png'],
    tags: ['聊起来笨笨的']
  },
  {
    id: 'F010',
    phone: '158****8901',
    time: '2025-01-15 09:15',
    content: '希望增加移动端支持，现在只能在电脑上使用，如果能用手机查看和操作就更方便了。',
    images: ['screenshot10.png', 'screenshot11.png'],
    tags: ['功能bug', '长得丑']
  }
];

let currentPage = 1;
let filteredFeedbacks = [...mockFeedbacks];
let selectedTag = '';
let pagination;
let imageModal;

document.addEventListener('DOMContentLoaded', function() {
  // 初始化分页
  pagination = new Pagination({
    currentPage: 1,
    pageSize: 10,
    totalItems: filteredFeedbacks.length,
    onPageChange: (page) => {
      currentPage = page;
      renderFeedbacks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // 初始化搜索
  createSearchHandler('searchInput', (query) => {
    applyFilters(query, selectedTag);
  });

  // 初始化模态框
  imageModal = new Modal('imageModal');

  // 标签筛选器点击事件
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      const tagValue = this.getAttribute('data-tag');
      selectedTag = selectedTag === tagValue ? '' : tagValue;
      
      // 更新标签筛选器状态
      document.querySelectorAll('.filter-tag').forEach(btn => {
        if (btn.getAttribute('data-tag') === selectedTag) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      
      const query = document.getElementById('searchInput').value.toLowerCase();
      applyFilters(query, selectedTag);
    });
  });
  
  renderFeedbacks();
});

function renderFeedbacks() {
  const list = document.getElementById('feedbackList');
  list.innerHTML = '';

  const start = (currentPage - 1) * 10;
  const end = start + 10;
  const pageData = filteredFeedbacks.slice(start, end);

  pageData.forEach(feedback => {
    const item = document.createElement('div');
    item.className = 'feedback-item';
    
    item.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-meta">
          <span>手机号：${feedback.phone}</span>
        </div>
        <div class="feedback-time">${feedback.time}</div>
      </div>
      <div class="feedback-content">${feedback.content}</div>
      ${feedback.tags && feedback.tags.length > 0 ? `
        <div class="feedback-tags">
          ${feedback.tags.map(tag => `
            <span class="feedback-tag" onclick="filterByTag('${tag}')">${tag}</span>
          `).join('')}
        </div>
      ` : ''}
      ${feedback.images.length > 0 ? `
        <div class="feedback-images">
          ${feedback.images.map((img, idx) => `
            <div class="feedback-image" onclick="showImage('${img}')">
              截图 ${idx + 1}
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
    
    list.appendChild(item);
  });
}

function applyFilters(query, tag) {
  filteredFeedbacks = mockFeedbacks.filter(feedback => {
    // 文本搜索
    const matchText = !query || 
      feedback.phone.includes(query) ||
      feedback.content.toLowerCase().includes(query);
    
    // 标签筛选
    const matchTag = !tag || 
      (feedback.tags && feedback.tags.includes(tag));
    
    return matchText && matchTag;
  });
  
  currentPage = 1;
  pagination.reset();
  pagination.setTotalItems(filteredFeedbacks.length);
  renderFeedbacks();
}

function filterByTag(tag) {
  selectedTag = tag;
  const query = document.getElementById('searchInput').value.toLowerCase();
  applyFilters(query, tag);
  
  // 更新标签筛选器状态
  document.querySelectorAll('.filter-tag').forEach(btn => {
    if (btn.getAttribute('data-tag') === tag) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function showImage(imageName) {
  const img = document.getElementById('modalImage');
  // 这里只是演示，实际应该使用真实的图片URL
  img.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzI1MjUyNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+${imageName}</dGV4dD48L3N2Zz4=`;
  imageModal.show();
}

function closeImageModal() {
  imageModal.close();
}

