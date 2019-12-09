//  配置文件的入口文件
module.exports = {
    title: '孙柯宝',
    description: '孙柯宝博客之家',
    configureWebpack: {
        resolve: {
          alias: {
            '@alias': 'path/to/some/dir'
          }
        }
      },
    themeConfig: {
      displayAllHeaders: true,// 默认值：false
      nav: [
        { text: 'Home', link: '/' },
        { text: 'JS基础', link: '/JS/' },
        { text: '计算机网络', link: '/Network/' },
        { text: '算法', link: '/Algorithm/' },
        // { text: 'External', 
        //   items: [
        //     { text: 'Chinese', link: '/language/chinese' },
        //     { text: 'Japanese', link: '/language/japanese' }
        //   ] 
        // },
      ]
    },
    sidebar: [
      '/',
      '/JS',
      '/Network'
      ['/page-b', 'Explicit link text']
    ]
}