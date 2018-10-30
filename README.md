# webpack-mutiple-entries
webpack多入口文件页面打包配置

## 目录结构
我们规定src目录结构需遵循如下：
```
src
├── page-a
│   ├── css
│   │   └── c.css
│   ├── index.html
│   └── js
│       └── index.js
└── page-b
    ├── css
    │   └── c.css
    ├── index.html
    └── js
        └── index.js
```

打包后dist目录结构基本和src结构一致，各个页面单独引入相应文件
```
dist
├── page-a
│   ├── index.html
│   └── static
│       ├── css
│       │   └── app.797115d.css
│       └── js
│           ├── app.666173e.js
│           └── app.a72e6a.js
└── page-b
    ├── index.html
    └── static
        ├── css
        │   └── app.42dff58.css
        └── js
            ├── app.666173e.js
            └── app.a72e6a.js
```

## 开发
```
1. npm install 

2. npm run dev

```

## 发布

```
1. npm run build
```
