export default {
  items: [
    {
      name: 'Công ty',
      url: '/company',
      icon: 'icon-star',
    },
    {
      name: 'Tài khoản',
      url: '/account',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Đổi mật khẩu',
          url: '/account/changepassword',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Quản lí lời mời',
      url: '/invitation',
      icon: 'icon-star',
    },
    {
      name: 'DSSV đăng kí thực tập',
      url: '/ojt_registration',
      icon: 'icon-star',
    },
    {
      name: 'DSSV chính thức',
      url: '/official-list',
      icon: 'icon-star',
    },
    {
      name: 'Chi tiết nhiệm vụ',
      url: '/details-task',
      icon: 'icon-star',
    },
    {
      name: 'Thông tin tuyển dụng',
      url: '/job-post',
      icon: 'icon-star',
    },
    // {
    //   name: 'test',
    //   url: '/test',
    //   icon: 'icon-speedometer',
    // },
    // {
    //   name: 'Dashboard',
    //   url: '/dashboard',
    //   icon: 'icon-speedometer',
    //   badge: {
    //     variant: 'info',
    //     text: 'NEW',
    //   },
    // },
    // {
    //   title: true,
    //   name: 'Theme',
    //   wrapper: {            // optional wrapper object
    //     element: '',        // required valid HTML5 element tag
    //     attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    //   },
    //   class: ''             // optional class names space delimited list for title item ex: "text-center"
    // },
    // {
    //   name: 'Colors',
    //   url: '/theme/colors',
    //   icon: 'icon-drop',
    // },
    // {
    //   name: 'Typography',
    //   url: '/theme/typography',
    //   icon: 'icon-pencil',
    // },
    // {
    //   title: true,
    //   name: 'Components',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'Base',
    //   url: '/base',
    //   icon: 'icon-puzzle',
    //   children: [
    //     {
    //       name: 'Breadcrumbs',
    //       url: '/base/breadcrumbs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Cards',
    //       url: '/base/cards',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Carousels',
    //       url: '/base/carousels',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Collapses',
    //       url: '/base/collapses',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Dropdowns',
    //       url: '/base/dropdowns',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Forms',
    //       url: '/base/forms',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Jumbotrons',
    //       url: '/base/jumbotrons',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'List groups',
    //       url: '/base/list-groups',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Navs',
    //       url: '/base/navs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Paginations',
    //       url: '/base/paginations',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Popovers',
    //       url: '/base/popovers',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Progress Bar',
    //       url: '/base/progress-bar',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Switches',
    //       url: '/base/switches',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tables',
    //       url: '/base/tables',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tabs',
    //       url: '/base/tabs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tooltips',
    //       url: '/base/tooltips',
    //       icon: 'icon-puzzle',
    //     },
    //   ],
    // },
    // {
    //   name: 'Buttons',
    //   url: '/buttons',
    //   icon: 'icon-cursor',
    //   children: [
    //     {
    //       name: 'Buttons',
    //       url: '/buttons/buttons',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button dropdowns',
    //       url: '/buttons/button-dropdowns',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button groups',
    //       url: '/buttons/button-groups',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Brand Buttons',
    //       url: '/buttons/brand-buttons',
    //       icon: 'icon-cursor',
    //     },
    //   ],
    // },
    // {
    //   name: 'Charts',
    //   url: '/charts',
    //   icon: 'icon-pie-chart',
    // },
    // {
    //   name: 'Icons',
    //   url: '/icons',
    //   icon: 'icon-star',
    //   children: [
    //     {
    //       name: 'CoreUI Icons',
    //       url: '/icons/coreui-icons',
    //       icon: 'icon-star',
    //       badge: {
    //         variant: 'info',
    //         text: 'NEW',
    //       },
    //     },
    //     {
    //       name: 'Flags',
    //       url: '/icons/flags',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Font Awesome',
    //       url: '/icons/font-awesome',
    //       icon: 'icon-star',
    //       badge: {
    //         variant: 'secondary',
    //         text: '4.7',
    //       },
    //     },
    //     {
    //       name: 'Simple Line Icons',
    //       url: '/icons/simple-line-icons',
    //       icon: 'icon-star',
    //     },
    //   ],
    // },
    // {
    //   name: 'Notifications',
    //   url: '/notifications',
    //   icon: 'icon-bell',
    //   children: [
    //     {
    //       name: 'Alerts',
    //       url: '/notifications/alerts',
    //       icon: 'icon-bell',
    //     },
    //     {
    //       name: 'Badges',
    //       url: '/notifications/badges',
    //       icon: 'icon-bell',
    //     },
    //     {
    //       name: 'Modals',
    //       url: '/notifications/modals',
    //       icon: 'icon-bell',
    //     },
    //   ],
    // },
    // {
    //   name: 'Widgets',
    //   url: '/widgets',
    //   icon: 'icon-calculator',
    //   badge: {
    //     variant: 'info',
    //     text: 'NEW',
    //   },
    // },
    // {
    //   divider: true,
    // },
    // {
    //   title: true,
    //   name: 'Extras',
    // },
    // {
    //   name: 'Pages',
    //   url: '/pages',
    //   icon: 'icon-star',
    //   children: [
    //     {
    //       name: 'Login',
    //       url: '/login',
    //       icon: 'icon-star',
    //     },
    // {
    //   name: 'Forgot Password',
    //   url: '/forgotpassword',
    //   icon: 'icon-star',
    // },
    //     {
    //       name: 'Error 404',
    //       url: '/404',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Error 500',
    //       url: '/500',
    //       icon: 'icon-star',
    //     },
    //   ],
    // },
    // {
    //   name: 'Disabled',
    //   url: '/dashboard',
    //   icon: 'icon-ban',
    //   attributes: { disabled: true },
    // },
    // {
    //   name: 'Download CoreUI',
    //   url: 'https://coreui.io/react/',
    //   icon: 'icon-cloud-download',
    //   class: 'mt-auto',
    //   variant: 'success',
    //   attributes: { target: '_blank', rel: "noopener" },
    // },
    // {
    //   name: 'Try CoreUI PRO',
    //   url: 'https://coreui.io/pro/react/',
    //   icon: 'icon-layers',
    //   variant: 'danger',
    //   attributes: { target: '_blank', rel: "noopener" },
    // },
  ],
};
