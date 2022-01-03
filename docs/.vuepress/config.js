module.exports = {
  title: '个人博客',
  head: [['link', { rel: 'icon', href: `/favicon.png` }]],
  ga: '',
  description: '个人博客.',
  themeConfig: {
    repo: 'https://github.com/ruanshr/blog',
    editLinks: false,
    editLinkText: 'Edit this page',
    lastUpdated: '更新日期',
    sidebar: {
      '/css/': ['css-animate-transition'],
      '/vue/': ['eslint-config', 'question'],
      '/javascript-base/': ['format','es6-format','es6-proxy','p6-questions','dom-api','js-memory','array-function'],
      '/nodejs/': ['introduction', 'koa']
    },
    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'javascript',
        link: '/javascript-base/format',
        items: [
          {
            text: 'css动画',
            link: '/css/css-animate-transition'
          },
          {
            text: 'git命令',
            link: '/git/git-commit'
          },
          {
            text: 'http跨域',
            link: '/http/domain'
          },
          {
            text: 'JavaScript 风格指南',
            link: '/javascript-base/format'
          },
          {
            text: 'vue 面试题',
            link: '/vue/question'
          },
          {
            text: 'ESLint 配置',
            link: '/vue/eslint-config'
          },
          {
            text: 'Nodejs浅谈',
            link: '/nodejs/introduction'
          },
          {
            text: 'koa源码架构设计',
            link: '/nodejs/koa'
          }
        ]
      }
    ],
    docsDir: 'docs'
  },
  base: '/blog/'
}
