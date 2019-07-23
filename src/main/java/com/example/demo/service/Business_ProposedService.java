package com.example.demo.service;

import com.example.demo.config.BusinessProposedStatus;
import com.example.demo.entity.*;
import com.example.demo.repository.IBusiness_ProposedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class Business_ProposedService implements IBusiness_ProposedService {

    @Autowired
    IBusiness_ProposedRepository iBusiness_proposedRepository;

    @Autowired
    ISemesterService iSemesterService;

    @Autowired
    IOjt_EnrollmentService iOjt_enrollmentService;

    @Autowired
    IStudentService iStudentService;

    @Autowired
    IEventService iEventService;

    @Autowired
    IUsersService iUsersService;

    @Override
    public List<Business_Proposed> getAll() {

        Semester semester = iSemesterService.getSemesterCurrent();
        List<Business_Proposed> business_proposeds = iBusiness_proposedRepository.findAll();

        List<Business_Proposed> business_proposedsSemesterCurrent = new ArrayList<>();

        for (int i = 0; i < business_proposeds.size(); i++) {
            Student student = business_proposeds.get(i).getStudent_proposed();
            Ojt_Enrollment ojt_enrollment = iOjt_enrollmentService.getOjtEnrollmentByStudentEmailAndSemesterId(student.getEmail(), semester.getId());
            if (ojt_enrollment != null) {
                business_proposedsSemesterCurrent.add(business_proposeds.get(i));
            }
        }
        return business_proposedsSemesterCurrent;
    }

    @Override
    public Business_Proposed findById(int id) {
        return iBusiness_proposedRepository.findById(id);
    }


    @Override
    public void updateStatusByStartUpRoom(int id, String comment, boolean status, String email) throws Exception {
        Business_Proposed business_proposed = findById(id);

        if (business_proposed != null) {
            business_proposed.setCommentStartupRoom(comment);

            if (status) {
                business_proposed.setIsAcceptedByStartupRoom(BusinessProposedStatus.ACCEPTED);
            } else {
                business_proposed.setIsAcceptedByStartupRoom(BusinessProposedStatus.REJECTED);
            }
            iBusiness_proposedRepository.save(business_proposed);
        }

        String descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
                business_proposed.getBusiness_name() + " của bạn đã bị từ chối bởi Phòng Khởi Nghiệp vì lý do: "
                + comment;
        String emailNextHeading = "headtraining@gmail.com";
        String contentEmail = "PHÒNG KHỞI NGHIỆP ĐÃ XEM XÉT VÀ CHẤP NHẬN YÊU CẤU THỰC TẬP TẠI DOANH NGHIỆP " + business_proposed.getBusiness_name()
                + " CỦA SINH VIÊN " + business_proposed.getStudent_proposed().getName() + "!\n" + "KÍNH MONG PHÒNG ĐÀO TẠO XEM XÉT TRƯỜNG HỢP!";

        createInformMessageAndSendMail(status, business_proposed, descriptionEvent, email, emailNextHeading, contentEmail);
    }

    @Override
    public void updateStatusByHeadOfTraining(int id, String comment, boolean status, String email) throws Exception {
        Business_Proposed business_proposed = findById(id);

        if (business_proposed != null) {
            business_proposed.setCommentHeadOfTraining(comment);
            if (status) {
                business_proposed.setIsAcceptedByHeadOfTraining(BusinessProposedStatus.ACCEPTED);
            } else {
                business_proposed.setIsAcceptedByHeadOfTraining(BusinessProposedStatus.REJECTED);
            }
            iBusiness_proposedRepository.save(business_proposed);
        }

        String descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
                business_proposed.getBusiness_name() + " của bạn đã bị từ chối bởi phòng Đào tạo vì lý do: "
                + comment;
        String emailNextHeading = "headmaster@gmail.com";
        String contentEmail = "PHÒNG ĐÀO TẠO ĐÃ XEM XÉT VÀ CHẤP NHẬN YÊU CẤU THỰC TẬP TẠI DOANH NGHIỆP " + business_proposed.getBusiness_name()
                + " CỦA SINH VIÊN " + business_proposed.getStudent_proposed().getName() + "!\n" + "KÍNH MONG HIỆU TRƯỞNG XEM XÉT TRƯỜNG HỢP!";

        createInformMessageAndSendMail(status, business_proposed, descriptionEvent, email, emailNextHeading, contentEmail);
    }

    @Override
    public void updateStatusByHeadMaster(int id, boolean status, String email) throws Exception {
        Business_Proposed business_proposed = findById(id);

        if (business_proposed != null) {
            if (status) {
                business_proposed.setIsAcceptedByHeadMaster(BusinessProposedStatus.ACCEPTED);
            } else {
                business_proposed.setIsAcceptedByHeadMaster(BusinessProposedStatus.REJECTED);
            }
            iBusiness_proposedRepository.save(business_proposed);
        }

        String descriptionEvent = "Xin chào " + business_proposed.getStudent_proposed().getName() + "! Lời đề nghị thực tập tại doanh nghiệp " +
                business_proposed.getBusiness_name() + " của bạn đã bị từ chối bởi Hiệu trưởng";
        String emailNextHeading = "";
        String contentEmail = "PHÒNG ĐÀO TẠO ĐÃ XEM XÉT VÀ CHẤP NHẬN YÊU CẤU THỰC TẬP TẠI DOANH NGHIỆP " + business_proposed.getBusiness_name()
                + " CỦA SINH VIÊN " + business_proposed.getStudent_proposed().getName() + "!\n" + "KÍNH MONG HIỆU TRƯỞNG XEM XÉT TRƯỜNG HỢP!";

        createInformMessageAndSendMail(status, business_proposed, descriptionEvent, email, emailNextHeading, contentEmail);
    }

    @Override
    public void createInformMessageAndSendMail(boolean status, Business_Proposed business_proposed, String descriptionEvent, String emailHeading, String emailNextHeading, String emailContent) throws Exception {
        if (!status) {
            // create inform message
            Event event = new Event();
            Date date = new Date(Calendar.getInstance().getTime().getTime());
            List<Student> studentList = new ArrayList<>();
            studentList.add(business_proposed.getStudent_proposed());

            event.setTitle("Kết quả đề xuất thực tập tại doanh nghiệp mới");
            event.setDescription(descriptionEvent);
            event.setTime_created(date);
            event.setStudents(studentList);
            event.setRead(false);
            event.setHeading_email(emailHeading);

            boolean create = iEventService.createEvent(event);

        } else if (status && !emailHeading.equals("headmaster@gmail.com")) {
            // gửi mail cho người kế tiếp
            iUsersService.sendEmailHeading(emailNextHeading, emailContent);
        } else {
            // Xử lí logic khúc này: add vô bảng business + set ojt_enrollment
        }
    }
}
