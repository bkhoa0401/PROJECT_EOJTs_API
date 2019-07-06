export default {
  items: [
    {
      name: 'Site Admin',
      url: '/admin',
      icon: 'icon-star',
    },
    {
      name: 'Quản lý tài khoản',
      url: '/admin_account',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Tài khoản sinh viên',
          url: '/admin_account/studentList',
          icon: 'icon-star',
        },
        {
          name: 'Tài khoản doanh nghiệp',
          url: '/admin_account/businessList',
          icon: 'icon-star',
        },
      ]
    },
    {
      name: 'Nhập tập tin',
      url: '/importfiles',
      icon: 'icon-star',

    },
    {
      name: 'Thông số lịch trình',
      url: '/scheduleparameters',
      icon: 'icon-star',
    },
    {
      name: 'Quản lý danh sách',
      url: '/list_management',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Danh sách sinh viên',
          url: '/list_management/student_list',
          icon: 'icon-star',
        },
        {
          name: 'Danh sách doanh nghiệp',
          url: '/list_management/business_list',
          icon: 'icon-star',
        },
      ]
    },
    {
      name: 'Chuyên ngành',
      url: '/specialized',
      icon: 'icon-star',
    },
    {
      name: 'Kỹ năng',
      url: '/skill',
      icon: 'icon-star',
    },
    {
      name: 'Tuyển dụng',
      url: '/Job_Post/Job_Post_List',
      icon: 'icon-star',
    },
    {
      name: 'Thông báo',
      url: '/InformMessage/InformMessage',
      icon: 'icon-star',
    },
    {
      name: 'Báo cáo',
      url: '/Report/Report',
      icon: 'icon-star',
    },
  ]
};
