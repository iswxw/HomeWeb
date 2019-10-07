module.exports = {
  base: '/HomeWeb/',
  title: '年少有伟',
  description: '技术笔记记录首页',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no'
      }
    ],
    ['link', { rel: 'icon', href: './favicon.ico' }]
  ],
  // 导航栏
  themeConfig: {
    // 你的GitHub仓库，请正确填写
    repo: 'https://github.com/GitHubWxw/HomeWeb',
    // 自定义仓库链接文字。
    repoLabel: 'HomeWeb',
    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: '后端技术', link: '/Java/博客首发.md' },
      {
        text: '前端技术',
        link: '/web/',
        items: [
          { text: 'es6', link: '/web/es6/' },
          { text: 'vue', link: '/web/vue/' },
          { text: 'H5', link: '/web/H5/' },
          { text: 'React', link: '/web/React/' }
        ]
      },
      { text: '项目', link: '/projects/' },
      { text: '指南', link: '/guide/' }
    ],
    // 侧边栏
    sidebar: [['/', '首页'], ['/blog/博客首发.md', '我的第一篇博客']],
    lastUpdated: 'Last Updated'
  }
};
