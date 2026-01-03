/* 产品反馈页面特定脚本 */

// 模拟会话数据（复用session_list.js中的部分数据）
const mockSessions = {
  'S001': {
    id: 'S001',
    time: '2025-01-15 14:20',
    title: 'BOM查询与生成',
    preview: '如何查询BOM中的某个器件的规格参数？帮我生成一份BOM清单',
    messages: [
      {
        role: 'user',
        content: '如何查询BOM中的某个器件的规格参数？'
      },
      {
        role: 'assistant',
        content: '收到! 我将基于双电源自动切换系统项目的历史版本, 分析并生成满足耐高温和纯国产要求的新BOM方案。',
        type: 'text'
      },
      {
        role: 'assistant',
        content: {
          type: 'tool',
          name: 'BOM档案读取工具',
          result: '已读取项目 双电源自动切换系统, 共找到3个历史版本:',
          versions: [
            { version: 'v1.0', date: '2024-01-15', desc: '初版设计 · 6个器件' },
            { version: 'v2.0', date: '2024-03-20', desc: '优化电源 · 6个器件' },
            { version: 'v2.1', date: '2024-05-10', desc: '降低成本 · 6个器件' }
          ]
        }
      },
      {
        role: 'assistant',
        content: {
          type: 'analysis',
          text: '分析完成。综合考虑新需求(耐高温性能+纯国产), 建议基于v2.1 版本进行改动。',
          reasons: [
            'v2.1 已具备-40°C~+85℃ 工作温度范围, 是较好的起点',
            '已有部分国产器件, 改动成本相对较低',
            '在成本控制上已做优化, 符合经济性要求'
          ]
        }
      }
    ]
  },
  'S002': {
    id: 'S002',
    time: '2025-01-15 13:45',
    title: '电路设计分析',
    preview: '帮我分析一下这个电路的设计是否合理',
    messages: [
      {
        role: 'user',
        content: '帮我分析一下这个电路的设计是否合理'
      },
      {
        role: 'assistant',
        content: '我来帮您分析这个电路设计。首先让我查看一下相关的电路图和参数。',
        type: 'text'
      },
      {
        role: 'assistant',
        content: {
          type: 'list',
          items: [
            '电源部分：采用24V输入，通过DC-DC转换器降至12V，效率85%，设计合理',
            '控制部分：使用MCU进行逻辑控制，支持-40~+125°C工作温度',
            '保护部分：包含过流保护和反向保护二极管，设计完善',
            '建议：可以考虑增加EMI滤波电路以提升抗干扰能力'
          ]
        }
      }
    ]
  }
};

// 模拟数据（第一页10条）
const mockFeedbacks = [
  {
    id: 'F001',
    phone: '138****1234',
    time: '2025-01-15 18:30',
    content: '希望可以支持批量导入BOM文件，现在一个一个上传太麻烦了。另外建议增加BOM版本对比功能，方便查看不同版本之间的差异。',
    images: ['screenshot1.png', 'screenshot2.png'],
    tags: ['物料数据不全', '功能bug'],
    sessionId: 'S001' // 关联会话
  },
  {
    id: 'F002',
    phone: '139****5678',
    time: '2025-01-15 17:20',
    content: '智能体回答有时候不够准确，特别是涉及到技术参数的时候，建议加强知识库的准确性。',
    images: ['screenshot3.png'],
    tags: ['聊起来笨笨的'],
    sessionId: 'S002' // 关联会话
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

  // 点击抽屉遮罩关闭
  document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);

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
    const hasSession = feedback.sessionId && mockSessions[feedback.sessionId];
    item.className = hasSession ? 'feedback-item has-session' : 'feedback-item';
    
    // 如果有会话关联，添加点击事件
    if (hasSession) {
      item.onclick = (e) => {
        // 如果点击的是标签或图片，不触发抽屉
        if (e.target.closest('.feedback-tag') || e.target.closest('.feedback-image')) {
          return;
        }
        showConversation(mockSessions[feedback.sessionId]);
      };
    }
    
    item.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-meta">
          <span>手机号：${feedback.phone}</span>
          ${hasSession ? '<span class="session-badge" title="点击查看关联会话"></span>' : ''}
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

// ========== 抽屉对话相关函数（复用session_list.js） ==========

function showConversation(session) {
  const drawer = document.getElementById('conversationDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const content = document.getElementById('conversationContent');
  const drawerTitle = document.getElementById('drawerTitle');
  
  // 设置抽屉标题为对话标题
  if (drawerTitle) {
    drawerTitle.textContent = session.title || '对话详情';
  }
  
  // 渲染对话内容
  content.innerHTML = '';
  
  session.messages.forEach((message, index) => {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message message-${message.role}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = `message-content message-content-${message.role}`;
    
    // 根据内容类型渲染
    if (typeof message.content === 'string') {
      messageContent.innerHTML = formatTextContent(message.content);
    } else if (message.content.type === 'table') {
      messageContent.appendChild(renderTable(message.content));
    } else if (message.content.type === 'list') {
      messageContent.appendChild(renderList(message.content));
    } else if (message.content.type === 'tool') {
      messageContent.appendChild(renderToolResult(message.content));
    } else if (message.content.type === 'analysis') {
      messageContent.appendChild(renderAnalysis(message.content));
    } else {
      messageContent.textContent = JSON.stringify(message.content);
    }
    
    messageWrapper.appendChild(messageContent);
    content.appendChild(messageWrapper);
  });
  
  // 滚动到顶部（从第一条消息开始）
  content.scrollTop = 0;
  
  // 显示抽屉
  drawer.classList.add('open');
  overlay.classList.add('show');
  
  // 禁止html和body滚动
  document.documentElement.classList.add('drawer-open');
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  const drawer = document.getElementById('conversationDrawer');
  const overlay = document.getElementById('drawerOverlay');
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  
  // 恢复html和body滚动
  document.documentElement.classList.remove('drawer-open');
  document.body.classList.remove('drawer-open');
}

function formatTextContent(text) {
  // 简单的文本格式化，支持换行
  return text.split('\n').map(line => {
    if (line.trim() === '') return '<br>';
    return `<p style="margin: 0 0 8px 0;">${escapeHtml(line)}</p>`;
  }).join('');
}

function renderTable(data) {
  const table = document.createElement('table');
  table.className = 'message-table';
  table.style.width = '100%';
  table.style.maxWidth = '100%';
  
  // 标题
  if (data.title) {
    const titleRow = document.createElement('tr');
    const titleCell = document.createElement('th');
    titleCell.colSpan = data.headers.length;
    titleCell.textContent = data.title;
    titleCell.style.textAlign = 'center';
    titleCell.style.fontWeight = '600';
    titleRow.appendChild(titleCell);
    table.appendChild(titleRow);
  }
  
  // 表头
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  data.headers.forEach((header, index) => {
    const th = document.createElement('th');
    th.textContent = header;
    // 为不同列设置合适的宽度
    if (index === 0) th.style.width = '15%';
    else if (index === 1) th.style.width = '10%';
    else if (index === 2) th.style.width = '12%';
    else if (index === 3) th.style.width = '20%';
    else if (index === 4) th.style.width = '10%';
    else if (index === 5) th.style.width = '13%';
    else if (index === 6) th.style.width = '20%';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // 表体
  const tbody = document.createElement('tbody');
  data.rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.style.wordBreak = 'break-word';
      td.style.overflowWrap = 'break-word';
      // 检查是否是链接
      if (cell.includes('查看规格说明书') || cell.includes('查看')) {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'message-link';
        link.textContent = cell;
        link.onclick = (e) => {
          e.preventDefault();
        };
        td.appendChild(link);
      } else {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  return table;
}

function renderList(data) {
  const ul = document.createElement('ul');
  ul.className = 'message-list';
  
  data.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
  
  return ul;
}

function renderToolResult(data) {
  const div = document.createElement('div');
  
  // 工具名称和结果（带图标）
  const toolHeader = document.createElement('div');
  toolHeader.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  `;
  
  const icon = document.createElement('div');
  icon.style.cssText = `
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: var(--color-teal);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  `;
  icon.innerHTML = '⚙';
  
  const headerText = document.createElement('div');
  headerText.style.flex = '1';
  headerText.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
    <div style="color: var(--text-muted); font-size: 13px;">${data.result}</div>
  `;
  
  toolHeader.appendChild(icon);
  toolHeader.appendChild(headerText);
  div.appendChild(toolHeader);
  
  // 版本列表
  if (data.versions) {
    const versionsDiv = document.createElement('div');
    versionsDiv.style.cssText = `
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 12px;
    `;
    
    data.versions.forEach(version => {
      const versionCard = document.createElement('div');
      versionCard.style.cssText = `
        padding: 12px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 6px;
        min-width: 150px;
        flex: 1;
      `;
      versionCard.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${version.version}</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">${version.date}</div>
        <div style="font-size: 13px;">${version.desc}</div>
      `;
      versionsDiv.appendChild(versionCard);
    });
    
    div.appendChild(versionsDiv);
  }
  
  // 选型结果
  if (data.selections) {
    const selectionsDiv = document.createElement('div');
    selectionsDiv.style.cssText = `
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 12px;
    `;
    
    data.selections.forEach(selection => {
      const selectionCard = document.createElement('div');
      selectionCard.style.cssText = `
        padding: 12px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 6px;
        flex: 1;
        min-width: 200px;
      `;
      
      const statusDiv = document.createElement('div');
      statusDiv.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
      `;
      statusDiv.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-teal);"></span>
        <span style="font-size: 12px; color: var(--color-teal);">${selection.status}</span>
      `;
      
      selectionCard.appendChild(statusDiv);
      
      const nameDiv = document.createElement('div');
      nameDiv.style.cssText = 'font-weight: 600; margin-bottom: 4px;';
      nameDiv.textContent = selection.name;
      selectionCard.appendChild(nameDiv);
      
      const modelDiv = document.createElement('div');
      modelDiv.style.cssText = 'font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px;';
      modelDiv.textContent = selection.model;
      selectionCard.appendChild(modelDiv);
      
      const descDiv = document.createElement('div');
      descDiv.style.cssText = 'font-size: 13px; color: var(--text-muted);';
      descDiv.textContent = selection.desc;
      selectionCard.appendChild(descDiv);
      
      selectionsDiv.appendChild(selectionCard);
    });
    
    div.appendChild(selectionsDiv);
  }
  
  return div;
}

function renderAnalysis(data) {
  const div = document.createElement('div');
  
  // 主文本
  if (data.text) {
    const textDiv = document.createElement('div');
    textDiv.style.cssText = `
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 16px;
    `;
    
    const icon = document.createElement('div');
    icon.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: var(--color-teal);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    `;
    icon.innerHTML = '⚙';
    
    const text = document.createElement('div');
    text.style.flex = '1';
    text.innerHTML = formatTextContent(data.text);
    
    textDiv.appendChild(icon);
    textDiv.appendChild(text);
    div.appendChild(textDiv);
  }
  
  // 选择理由
  if (data.reasons) {
    const reasonsDiv = document.createElement('div');
    reasonsDiv.style.marginTop = '16px';
    reasonsDiv.innerHTML = '<div style="font-weight: 600; margin-bottom: 8px;">选择理由：</div>';
    
    const reasonsList = document.createElement('ul');
    reasonsList.className = 'message-list';
    data.reasons.forEach(reason => {
      const li = document.createElement('li');
      li.textContent = reason;
      reasonsList.appendChild(li);
    });
    reasonsDiv.appendChild(reasonsList);
    div.appendChild(reasonsDiv);
  }
  
  // 需要改动的关键器件
  if (data.changes) {
    const changesDiv = document.createElement('div');
    changesDiv.style.marginTop = '16px';
    changesDiv.innerHTML = '<div style="font-weight: 600; margin-bottom: 8px;">需要改动的关键器件：</div>';
    
    data.changes.forEach((change, index) => {
      const changeItem = document.createElement('div');
      changeItem.style.cssText = `
        margin-bottom: 12px;
        padding: 12px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 6px;
      `;
      changeItem.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${index + 1}. ${change.component}</div>
        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px;">${change.original}</div>
        <div style="font-size: 13px;">→ ${change.note}</div>
      `;
      changesDiv.appendChild(changeItem);
    });
    
    div.appendChild(changesDiv);
  }
  
  return div;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

