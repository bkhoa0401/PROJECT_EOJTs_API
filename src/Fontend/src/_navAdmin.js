export default {
  items: [
    {
      name: 'Dashboard',
      url: '/admin',
      icon: 'icon-speedometer',
    },
    {
      name: 'Quản lý tài khoản',
      url: '/admin_account',
      icon: 'icon-user',
      children: [
        {
          name: 'Tài khoản sinh viên',
          url: '/admin_account/studentList',
          icon: 'icon-graduation',
        },
        {
          name: 'Tài khoản doanh nghiệp',
          url: '/admin_account/businessList',
          icon: 'icon-briefcase',
        },
      ]
    },
    {
      name: 'Nhập tập tin',
      url: '/importfiles',
      icon: 'icon-folder',

    },
    {
      name: 'Thông số lịch trình',
      url: '/scheduleparameters',
      icon: 'icon-calendar',
    },
    {
      name: 'Quản lý danh sách',
      url: '/list_management',
      icon: 'icon-list',
      children: [
        {
          name: 'Danh sách sinh viên',
          url: '/list_management/student_list',
          icon: 'icon-graduation',
        },
        {
          name: 'Danh sách doanh nghiệp',
          url: '/list_management/business_list',
          icon: 'icon-briefcase',
        },
      ]
    },
    {
      name: 'Chuyên ngành',
      url: '/specialized',
      icon: 'icon-compass',
    },
    {
      name: 'Kỹ năng',
      url: '/skill',
      icon: 'icon-puzzle',
    },
    {
      name: 'Tuyển dụng',
      url: '/Job_Post/Job_Post_List',
      icon: 'icon-directions',
    },
    {
      name: 'Thông báo',
      url: '/InformMessage/InformMessage',
      icon: 'icon-envelope-letter',
    },
    {
      name: 'Đánh giá',
      url: '/Report/Report',
      icon: 'icon-docs',
    },
    // {
    //   name: 'Phản hồi',
    //   url: '/Feedback/Feedback',
    //   icon: 'icon-star',
    // },
    {
      name: 'Thống kê khảo sát',
      url: '/answer-statistics',
      icon: 'icon-book-open',
    },
    {
      name: 'Quản lí câu hỏi',
      url: '/question',
      icon: 'icon-question',
    }
  ]
};
