# Repository Guidelines

## 项目结构与模块组织
`src/main.js` 是应用入口，负责挂载 `router`、`store` 和全局样式。路由与权限控制分别位于 `src/router/index.js`、`src/permission.js`；接口请求统一走 `src/utils/request.js`。业务页面按领域拆分在 `src/views/`，例如 `EngineeringInformation`、`SafetyManagement`、`VideoMonitoring`。通用组件放在 `src/components/`，接口封装放在 `src/api/`，本地模拟数据放在 `src/mock/`，样式资源集中在 `src/assets/`。`public/` 存放静态图片、字体和第三方库文件。

## 构建、测试与开发命令
`npm install`：安装依赖。  
`npm run serve`：启动 Vue CLI 本地开发服务。  
`npm run build`：生成生产包，发布路径和文件名规则受 `vue.config.js` 控制。  
`npm run lint`：执行 ESLint 检查。  
当前 `package.json` 未提供 `test` 脚本，修改前不要引用 `npm run test` 作为现有能力。

## 编码风格与命名约定
默认沿用现有 Vue 2 + Options API 风格，JavaScript 和 Vue 文件统一使用 2 空格缩进。保持现有的无分号写法、`@/` 路径别名和按模块分目录的组织方式。页面组件文件使用 PascalCase 或业务目录下的 `index.vue`，API 文件使用小写模块名，如 `src/api/safety.js`。新增逻辑优先复用 `src/utils/request.js` 的请求实例，不要直接散落创建 axios 实例。

## 测试与验证要求
仓库当前没有落地的自动化测试框架，提交前至少执行 `npm run lint` 和 `npm run build`。涉及路由、权限或接口改动时，需手工验证登录跳转、菜单访问权限和接口报错提示。若后续补充测试，建议放在 `src/__tests__/` 或与组件同目录，并保持“一个功能点一组用例”的粒度。

## 提交与 Pull Request 要求
最近提交信息以简短中文描述为主，例如“优化代码”“修改登出”“新加ar视频监控”。继续沿用“动词 + 变更对象/结果”的写法，单次提交聚焦一个主题。PR 需说明变更范围、影响页面、验证命令和手工验证结果；界面改动请附截图，接口或配置变动请注明 `.env.*`、`public/libs/` 或部署路径 `/dp/` 是否需要同步调整。

## 配置与资源注意事项
`vue.config.js` 将 `vue`、`vuex`、`axios`、`echarts`、`swiper`、`element-ui` 设为 externals，并从 `public/libs/` 注入；升级这些依赖时，必须同时检查 `public/libs/**` 文件是否匹配。环境变量位于 `.env.development` 和 `.env.production`，发布前确认 `VUE_APP_BASE_API` 与生产 `publicPath` 设置一致。
