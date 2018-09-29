module.exports = {
  base: '/mVue/',
  title: 'Vue深入学习',
  description: '解析 Vue 源码，深入理解 Vue',
  head: [
    ['link', {
      rel: 'icon',
      href: '/logo.png'
    }]
  ],
  markdown: {
    toc: {
      includeLevel: [2, 3, 4, 5, 6]
    }
  },
  themeConfig: {
    repo: 'shipengqi/mVue',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '错别字纠正',
    sidebarDepth: 3,
    nav: [{
      text: '正文',
      link: '/deep/',
    }, {
      text: 'mVue 实现',
      link: '/impl/'
    }, {
      text: '部署',
      link: '/vpdeploy/'
    }],
    sidebar: {
      '/deep/': [{
        title: '正文（持续更新中...）',
        children: [
          ''
        ]
      }],
      '/impl/': [{
        title: 'mVue 实现',
        children: [
          ''
        ]
      }],
      '/vpdeploy/': [{
        title: '部署',
        children: [
          ''
        ]
      }]
    }
  }
};
