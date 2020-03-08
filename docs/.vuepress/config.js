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
        text: '中间件',
        items: [
          {text:'RPC远程服务Dubbo',link:'http://dubbo.apache.org/zh-cn/docs/user/quick-start.html'},
          {text:'注册中心zookeeper ',link:'http://dubbo.apache.org/zh-cn/docs/user/references/registry/zookeeper.html'},
          {text:'消息队列RabbitMQ',link:'https://www.rabbitmq.com/getstarted.html'},
          {text:'搜索引擎ES',link:'https://github.com/elastic/elasticsearch'},
          {text:'分布式缓存Redis',link:'https://redis.io'},
          {text:'NoSql数据库mycat',link:'http://www.mycat.io'},
          {text:'测试与部署',
           items:[
            {text:'容器化技术Docker',link:'https://www.docker.com/get-started'},
            {text:'自动化集成Jekins',link:'https://github.com/jenkinsci/jenkins'}
           ]
          },
        ]
      },
      {
        text: '前端技术',
        items: [
          { text: 'VUE', link: 'https://cn.vuejs.org/v2/api/' },
          { text: 'Axios', link: 'https://www.kancloud.cn/yunye/axios/234845' },
          { text: 'CSS', link: 'https://www.w3cschool.cn/css/css-link.html' },
          { text: 'Jquery', link: 'https://www.jquery123.com/' },
        ]
      },
      {
        text: '在线工具',
        items: [
          { text: 'JSON 编辑器', link: 'https://www.bejson.com/jsoneditoronline' },
          { text: '二维码生成器', link: 'https://cli.im' },
          { text: 'Properties<->Yml', link: 'https://www.toyaml.com/index.html' },
          { text: 'MD表格生成器', link: 'https://tableconvert.com/?output=text' },
          { text: 'CRON表达式', link: 'http://cron.qqe2.com' },
          { text: 'JWT 解码', link: 'https://jwt.io/#debugger' },
          { text: '数据加解密', link: 'https://www.webjars.org' },
          { text: '图片编辑', link: 'https://www.uupoop.com/zp' },
          { text: '在线手册', link: 'http://www.fly63.com/tool' },
          { text: '菜鸟工具', link: 'https://c.runoob.com' },
          {text: '开源镜像',
          items:[
           { text: '阿里OPSX', link: 'https://www.bootcdn.cn' },
           { text: 'Azure', link: 'https://mirror.azure.cn' },
           { text: 'Docker Hub', link: 'https://hub.docker.com' }
           ] 
          },
          {text: '在线服务',
           items:[
            { text: 'Boot CDN', link: 'https://www.bootcdn.cn' },
            { text: '腾讯开发手册', link: 'https://cloud.tencent.com/developer/devdocs' }
            ] 
          },
        ]
      },
      {
        text: '项目案例',
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
