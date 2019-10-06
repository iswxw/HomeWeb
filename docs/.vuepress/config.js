module.exports = {
  base: '/HomeWeb/',
  title: '技术笔记记录首页',
  description: '技术笔记记录首页',

  // 导航栏
  themeConfig: {
    // 你的GitHub仓库，请正确填写
    repo: 'https://github.com/GitHubWxw/HomeWeb',
    // 自定义仓库链接文字。
    repoLabel: 'HomeWeb',
    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: '博客首发', link: '/blog/博客首发.md' }
    ],
    // 侧边栏
    sidebar: [['/', '首页'], ['/blog/博客首发.md', '我的第一篇博客']]
  }
};
