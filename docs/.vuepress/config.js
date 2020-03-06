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
    //repo: 'https://localhost:8080/HomeWeb',
    // 自定义仓库链接文字。
    repoLabel: 'HomeWeb',
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '后端技术',
        link: '/Java/',
        items: [
          { text: '算法与数据结构', link: '/Java/算法与数据结构/' },
          {
            text: 'JVM虚拟机',
            link: '/Java/JVM虚拟机/',
            items: [
              {
                text: '垃圾回收算法',
                link: '/Java/JVM虚拟机/垃圾回收算法.html'
              }
            ]
          },
          {
            text: 'Java并发编程',
            link: '/Java/Java并发编程/',
            items: [
              {
                text: 'MySQL基础',
                link: '/Java/数据库技术/MySql基础.html'
              }
            ]
          },
          {
            text: '数据库技术',
            link: '/Java/数据库技术/',
            items: [
              {
                text: 'SQL优化笔记',
                link: '/Java/数据库技术/SQL优化笔记.html'
              },
              {
                text: 'MySQL基础',
                link: '/Java/数据库技术/MySql基础.html'
              }
            ]
          },
          {
            text: 'Spring',
            link: '/Java/Spring/',
            items: [
              {
                text: 'MySQL基础',
                link: '/Java/数据库技术/MySql基础.html'
              }
            ]
          },
          {
            text: 'SpringBoot',
            link: '/Java/SpringBoot/springboot基础入门.html'
          },
          { text: '微服务技术', link: '/Java/微服务技术/' },
          { text: 'Linux', link: '/Java/Linux/' }
        ]
      },
      {
        text: '前端技术',
        link: '/Web/',
        items: [
          { text: '工具框架', link: '/Web/工具框架/' },
          { text: 'VUE', link: '/Web/VUE/' },
          { text: 'JavaScript', link: '/Web/JavaScript/' },
          { text: 'Html&CSS', link: '/Web/Html&CSS/' },
          { text: '前端小知识', link: '/Web/前端小知识/' }
        ]
      },
      {
        text: '项目',
        link: '/projects/',
        items: [
          { link: '/projects/乐优商城介绍.md', text: '' },
          { text: '（1）乐优商城项目', link: '/projects/乐优商城介绍.html' }
        ]
      },
      { text: '友链', link: '/guide/' }
    ],
    // 侧边栏
    // sidebar: [['./', '首页'], ['/blog/博客首发.md', '我的第一篇博客']],
    sidebar: [
      ['/', '首页导读'],
      ['/blog/Java实习总结.md', '1，Java实习总结'],
      ['/Java/SpringBoot/springboot基础入门.md', '2，SpringBoot基础'],
      ['/Java/数据库技术/SQL优化笔记.md', '3，SQL优化笔记'],
      ['/projects/乐优商城介绍.md', '4，购物商城项目']
      // ['/Java/算法与数据结构/', ''],
      // ['/Java/JVM虚拟机/', '常用垃圾回收算法'],
      // ['/Java/Java并发编程/', ''],
      // ['/Java/Spring/', ''],
      // ['/Java/SpringBoot/', ''],
      // ['/Java/微服务技术/', ''],
      // ['/Java/Linux/', ''],
      // ['/Web/工具框架/', ''],
      // ['/Web/VUE/', ''],
      // ['/Web/Html&CSS/', ''],
      // ['/Web/前端小知识/', '']
    ],
    lastUpdated: '最近更新时间'
  }
};
