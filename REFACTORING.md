# 代码重构说明

## 重构概述

本次重构将原本臃肿的独立HTML文件中的通用CSS样式和JS代码抽离出来，形成了清晰的代码架构。

## 新的目录结构

```
硅宝后台/
├── css/                    # CSS样式文件目录
│   ├── common.css          # 通用样式（CSS变量、重置样式、基础样式）
│   ├── dashboard.css       # 看板页面专用样式
│   ├── admin.css           # 管理页面专用样式（用户列表、产品反馈等）
│   ├── login.css           # 登录页面专用样式
│   └── main.css            # 主布局页面专用样式
├── js/                     # JavaScript文件目录
│   ├── common.js           # 通用JS功能（分页、搜索、模态框等）
│   ├── wordcloud.js        # 词云生成功能
│   ├── dashboard_bom.js    # BOM看板页面特定脚本
│   ├── user_list.js        # 用户列表页面特定脚本
│   ├── user_feedback.js    # 产品反馈页面特定脚本
│   ├── main.js             # 主布局页面脚本
│   └── login.js             # 登录页面脚本
├── index.html              # 登录页面
├── main.html               # 主布局页面
├── dashboard_user.html     # 用户运营看板
├── dashboard_agent.html    # 智能体运营看板
├── dashboard_bom.html      # BOM及知识库运营看板
├── user_list.html          # 用户列表
└── user_feedback.html      # 产品反馈
```

## 文件说明

### CSS文件

#### `css/common.css`
- 包含所有CSS变量定义（颜色、字体等）
- 全局重置样式
- 通用组件样式（页面头部、搜索栏、分页、模态框、按钮等）

#### `css/dashboard.css`
- 看板页面专用样式
- KPI卡片、图表容器、网格布局、词云等样式

#### `css/admin.css`
- 管理页面专用样式
- 表格、筛选标签、反馈列表、会话项等样式

#### `css/login.css`
- 登录页面专用样式
- 登录容器、表单、错误消息等样式

#### `css/main.css`
- 主布局页面专用样式
- 侧边栏、顶部栏、内容区域等样式

### JavaScript文件

#### `js/common.js`
- 通用功能类库
- `Pagination` 类：分页功能
- `Modal` 类：模态框功能
- `createSearchHandler`：搜索功能
- `initTableSort`：表格排序功能
- 工具函数：数字格式化、日期格式化等

#### `js/wordcloud.js`
- 词云生成功能
- `createWordCloud` 函数

#### 页面特定JS文件
- `dashboard_bom.js`：BOM看板的词云数据初始化
- `user_list.js`：用户列表的数据处理和交互逻辑
- `user_feedback.js`：产品反馈的数据处理和交互逻辑
- `main.js`：主布局的导航切换和登录检查
- `login.js`：登录表单处理和登录状态检查

## 使用方式

### HTML文件引用

每个HTML文件现在只需要引用相应的CSS和JS文件：

**看板页面示例（dashboard_bom.html）：**
```html
<link rel="stylesheet" href="css/common.css" />
<link rel="stylesheet" href="css/dashboard.css" />
<script src="js/wordcloud.js"></script>
<script src="js/dashboard_bom.js"></script>
```

**管理页面示例（user_list.html）：**
```html
<link rel="stylesheet" href="css/common.css" />
<link rel="stylesheet" href="css/admin.css" />
<script src="js/common.js"></script>
<script src="js/user_list.js"></script>
```

## 重构优势

1. **代码复用**：通用样式和功能只需维护一份
2. **易于维护**：修改通用样式只需修改一个文件
3. **结构清晰**：按功能模块组织代码
4. **减少冗余**：消除了大量重复代码
5. **性能优化**：浏览器可以缓存CSS和JS文件

## 注意事项

1. 所有HTML文件中的内联`<style>`和`<script>`标签已移除
2. 页面特定的数据（如mock数据）保留在对应的JS文件中
3. 通用功能已封装成可复用的类和函数
4. 确保CSS和JS文件的路径正确，建议使用相对路径

## 后续优化建议

1. 可以考虑使用构建工具（如Webpack、Vite）进行打包和压缩
2. 可以引入CSS预处理器（如Sass、Less）提高CSS开发效率
3. 可以考虑使用模块化的JS框架（如Vue、React）进一步优化代码结构

