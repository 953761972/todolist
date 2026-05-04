# Todolist

一个基于 Vue 3 + Vite 的轻量待办事项项目，支持新增、编辑、删除、完成状态切换、筛选、统计和本地持久化。

## 功能

- 新增待办事项
- 编辑任务标题
- 标记任务完成或恢复为进行中
- 按全部、进行中、已完成筛选
- 清空已完成任务
- 使用 `localStorage` 自动保存

## 运行

安装依赖：

```bash
npm install
```

本地开发：

```bash
npm run dev
```

生产打包：

```bash
npm run build
```

## 文件结构

```text
.
├── index.html
├── package.json
├── vite.config.js
├── src
│   ├── App.vue
│   ├── main.js
│   └── styles.css
└── README.md
```
