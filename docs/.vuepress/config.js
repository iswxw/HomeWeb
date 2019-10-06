module.exports = {
  title: '年少 有伟',
  description: 'The description of the site.',
  head: [
    ['link', { rel: 'shortcut icon', href: './public/icons/favicon.ico' }]
  ],
  base: '/HomeWeb/',
  dest: './dist',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '项目', link: '/projects/' },
      { text: '指南', link: '/guide/' },
      { text: 'GitHub', link: 'https://github.com/GitHubWxw' }
    ],
    sidebar: {
      '/guide/': genSidebarConfig('Guide')
    },
    lastUpdated: 'Last Updated'
  },

  markdown: {
    // options for markdown-it-anchor
    anchor: { permalink: false },
    config: md => {
      md.use(require('markdown-it-katex'));
    }
  }
};

function genSidebarConfig(title) {
  return [
    {
      title,
      collapsable: false,
      children: ['', 'getting-started', 'customize', 'advanced']
    }
  ];
}
