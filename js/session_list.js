/* 会话列表页面脚本 */

// 从URL参数获取用户信息
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    userId: params.get('userId') || 'U001',
    username: params.get('username') || '张三'
  };
}

// 模拟会话数据
const mockSessions = [
  {
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
          ],
          changes: [
            {
              component: '控制MCU',
              original: 'STM32F030C8T6 (ST)',
              note: '需替换为兼容的国产MCU, 要求支持-40~+125°C'
            },
            {
              component: '功率MOSFET',
              original: 'IRFB4115PBF (Infineon)',
              note: '需替换为耐高温国产MOS管'
            }
          ]
        }
      },
      {
        role: 'assistant',
        content: {
          type: 'tool',
          name: '物料查询与选型工具',
          result: '开始并行执行物料查询和选型任务:',
          selections: [
            {
              name: '控制MCU选型',
              status: '选型完成',
              model: 'HC32F030C8TA',
              desc: '华大半导体, Cortex-M0+, 64KB Flash, LQFP48, pin-to-pin兼容STM32'
            },
            {
              name: '功率MOSFET选型',
              status: '选型完成',
              model: 'NCE100N15',
              desc: '新洁能, 150V/100A, Rds=7.5mΩ, ΤΟ-220, -55~+175°C'
            }
          ]
        }
      },
      {
        role: 'assistant',
        content: '分析完成。综合考虑新需求(耐高温性能+纯国产), 建议基于v2.1 版本进行改动。',
        type: 'text'
      },
      {
        role: 'user',
        content: '帮我生成一份BOM清单'
      },
      {
        role: 'assistant',
        content: {
          type: 'table',
          title: '电源切换模块 BOM清单 v3.0(高温国产版)',
          headers: ['型号', '位号', '分类', '核心参数', '封装', '制造商', '规格书'],
          rows: [
            ['SGM809', 'U1', '电压检测芯片', '3.3V基准,1%精度,-40~+125°C', 'SOT-23', '圣邦微', '查看规格说明书'],
            ['NCE100N15', 'Q1,Q2', '功率MOSFET', '150V/100A, Rds=7.5mΩ', 'TO-220', '新洁能', '查看规格说明书'],
            ['B2412LS-1WR3', 'U2', 'DC-DC转换器', '24V转12V/3W,85%效率', 'SIP-4', '金升阳', '查看规格说明书'],
            ['HC32F030C8TA', 'U3', '控制MCU', 'Cortex-M0+, 64KB Flash', 'LQFP48', '华大半导体', '查看规格说明书'],
            ['LR2512-01R010FL', 'R1,R2', '电流检测电阻', '10mΩ/2W, ±1%精度', '2512', '丽智', '查看规格说明书'],
            ['SS34', 'D1,D2', '保护二极管', '40V/3A, Vf=0.45V', 'SMA', '长电', '查看规格说明书']
          ]
        }
      }
    ]
  },
  {
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
  },
  {
    id: 'S003',
    time: '2025-01-14 16:30',
    title: '知识库查询',
    preview: '知识库中有关于EMI测试的相关文档吗？',
    messages: [
      {
        role: 'user',
        content: '知识库中有关于EMI测试的相关文档吗？'
      },
      {
        role: 'assistant',
        content: '是的，知识库中有多份关于EMI测试的文档。我为您找到了以下相关文档：',
        type: 'text'
      },
      {
        role: 'assistant',
        content: {
          type: 'list',
          items: [
            'EMI测试标准与规范.pdf',
            'EMI测试方法与实践.docx',
            'EMI滤波器设计指南.pdf'
          ]
        }
      }
    ]
  },
  {
    id: 'S004',
    time: '2025-01-14 10:15',
    title: '器件性能对比',
    preview: '对比一下这两个器件的性能差异',
    messages: [
      {
        role: 'user',
        content: '对比一下STM32F030C8T6和HC32F030C8TA这两个器件的性能差异'
      },
      {
        role: 'assistant',
        content: {
          type: 'table',
          title: '器件性能对比',
          headers: ['参数', 'STM32F030C8T6', 'HC32F030C8TA'],
          rows: [
            ['制造商', 'ST', '华大半导体'],
            ['工作温度', '-40~+85°C', '-40~+125°C'],
            ['Flash', '64KB', '64KB'],
            ['RAM', '8KB', '8KB'],
            ['封装', 'LQFP48', 'LQFP48'],
            ['Pin兼容', '是', '是']
          ]
        }
      }
    ]
  },
  {
    id: 'S005',
    time: '2025-01-13 15:20',
    title: 'BOM生成',
    preview: '帮我生成一份BOM清单',
    messages: [
      {
        role: 'user',
        content: '帮我生成一份BOM清单'
      },
      {
        role: 'assistant',
        content: '好的，我将为您生成BOM清单。请稍候...',
        type: 'text'
      }
    ]
  }
];

let currentSessions = [...mockSessions];

document.addEventListener('DOMContentLoaded', function() {
  const { userId, username } = getUrlParams();
  
  // 显示用户信息
  document.getElementById('userInfo').textContent = `用户：${username} (${userId})`;
  
  // 渲染会话列表
  renderSessionList();
  
  // 点击抽屉遮罩关闭
  document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);
});

function renderSessionList() {
  const container = document.getElementById('sessionList');
  container.innerHTML = '';
  
  if (currentSessions.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">暂无会话记录</div>';
    return;
  }
  
  currentSessions.forEach(session => {
    const item = document.createElement('div');
    item.className = 'session-item';
    item.onclick = () => showConversation(session);
    
    item.innerHTML = `
      <div class="session-item-header">
        <span class="session-item-time">${session.time}</span>
        <span style="font-size: 12px; color: var(--text-muted);">${session.id}</span>
      </div>
      <div class="session-item-preview">${session.preview}</div>
      <div class="session-item-meta">
        <span>${session.messages.length} 条消息</span>
      </div>
    `;
    
    container.appendChild(item);
  });
}

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
    if (index === 0) th.style.width = '15%'; // 型号
    else if (index === 1) th.style.width = '10%'; // 位号
    else if (index === 2) th.style.width = '12%'; // 分类
    else if (index === 3) th.style.width = '20%'; // 核心参数
    else if (index === 4) th.style.width = '10%'; // 封装
    else if (index === 5) th.style.width = '13%'; // 制造商
    else if (index === 6) th.style.width = '20%'; // 规格书
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
          // 这里可以添加查看规格书的逻辑
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

function closeDrawer() {
  const drawer = document.getElementById('conversationDrawer');
  const overlay = document.getElementById('drawerOverlay');
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  
  // 恢复html和body滚动
  document.documentElement.classList.remove('drawer-open');
  document.body.classList.remove('drawer-open');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

