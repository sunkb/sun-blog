//  配置文件的入口文件
module.exports = {
    title: '孙柯宝前端蜗牛🐌',
    description: '前端博客之家',
    configureWebpack: {
        resolve: {
          alias: {
            '@alias': 'path/to/some/dir'
          }
        }
    },
    head:[
      ['link',{rel:'icon',href:'/favicon.ico'}]
    ],
    themeConfig: {
      displayAllHeaders: false,// 默认值：false
      sidebarDepth: 2,
      logo: 'http://q285gdauq.bkt.clouddn.com/sunligjt.jpg',
      // activeHeaderLinks: false,
      nav: [
        { text: 'Home', link: '/' },
        { text: 'JS基础', link: '/JS/' },
        { text: 'Vue', link: '/Vue/vue' },
        { text: 'React半解', link: '/React/' },
        { text: '计算机网络', link: '/Network/' },
        { text: '浏览器', link: '/Browser/browser' },
        { text: '网络安全', link: '/Safety/safe' },
        { text: '性能优化点', link: '/Performance/performance' },
        { text: '数据结构', link: '/Datastruct/datastruct' },
        { text: '算法', link: '/Algorithm/' },
        // { text: 'External', 
        //   items: [
        //     { text: 'Chinese', link: '/language/chinese' },
        //     { text: 'Japanese', link: '/language/japanese' }
        //   ] 
        // },
      ],
      // sidebar: [
      //   ['/JS/', 'JS基础'],
      //   ['/Network/','网络相关'],
      //   ['/Algorithm/','算法'],
      //   {
      //     title: 'JavaScript', // 侧边栏名称
      //     collapsable: true, // 可折叠
      //     children: [
      //       {content:'/blog/JavaScript/es6', // 你的md文件地址
      //       title:'es6',}
      //     ]
      //   },
      //   {
      //     title: 'CSS', 
      //     collapsable: true,
      //     children: [
      //       '/blog/CSS/zindex',
      //     ]
      //   },
      //   {
      //     title: 'HTTP',
      //     collapsable: true,
      //     children: [
      //       '/blog/HTTP/http',
      //     ]
      //   },
      // ],
      sidebar: 'auto',
      smoothScroll: true
    },
}