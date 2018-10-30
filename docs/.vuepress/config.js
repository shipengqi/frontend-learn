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
      text: '基础',
      link: '/basic/',
    },{
      text: '深入',
      link: '/deep/',
    }, {
      text: 'mVue 实现',
      link: '/impl/'
    }, {
      text: 'VuePress',
      link: '/vpdeploy/'
    }],
    sidebar: {
      '/basic/': [{
        title: '基础（持续更新中...）',
        children: [
          '',
          'computed',
          'command',
          'event',
          'form',
          'component',
          'component_pack',
          'custom_command',
          'render',
          'mixin',
          'plugin',
          'vue_router',
          'vuex'
        ]
      }],
      '/deep/': [{
        title: '深入（持续更新中...）',
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
