package com.example.demo.service;

import com.example.demo.config.ReportName;
import com.example.demo.config.ReportType;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.IAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService implements IAdminService {
    @Autowired
    IAdminRepository IAdminRepository;

    @Autowired
    IBusinessService businessService;

    @Autowired
    IJob_PostService job_postService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    IStudentService iStudentService;

    @Autowired
    IEvaluationService iEvaluationService;

    @Autowired
    IQuestionService iQuestionService;

    @Autowired
    IStudent_AnswerService iStudent_answerService;

    @Autowired
    IAnswerService iAnswerService;

    @Autowired
    ISemesterService iSemesterService;

    @Override
    public Admin findAdminByEmail(String email) {
        Admin admin = IAdminRepository.findAdminByEmail(email);
        if (admin != null) {
            return admin;
        }
        return null;
    }

    @Override
    public boolean updateAdmin(Admin admin) {
        Admin adminFindByEmail = IAdminRepository.findAdminByEmail(admin.getEmail());
        if (adminFindByEmail != null) {
            IAdminRepository.save(admin);
            return true;
        }
        return false;
    }

    //check semester // ok
    @Override
    public List<Business_ListJobPostDTO> getJobPostsOfBusinesses() {
        // List<Business> businessList = businessService.getAllBusiness();

        List<Business> businessList = businessService.getAllBusinessBySemester();
        List<Business_ListJobPostDTO> business_listJobPostDTOS = new ArrayList<>();

        for (int i = 0; i < businessList.size(); i++) {

            //Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjt_enrollmentOfBusiness(businessList.get(i));
            Semester semesterCurrent = semesterService.getSemesterCurrent();
            Ojt_Enrollment ojt_enrollment =
                    ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessList.get(i).getEmail(), semesterCurrent.getId());

            List<Job_Post> job_postList = job_postService.getAllJobPostOfBusiness(ojt_enrollment);

            Business_ListJobPostDTO business_jobPostDTO = new Business_ListJobPostDTO();
            business_jobPostDTO.setJob_postList(job_postList);
            business_jobPostDTO.setBusiness(businessList.get(i));

            business_listJobPostDTOS.add(business_jobPostDTO);
        }
        return business_listJobPostDTOS;
    }

    //finish
    //Warning: Don't modify this, i get high when i wrote this
    //get suggested business for student
    @Override
    public List<Business> getSuggestedBusinessListForFail(Student student) {
        List<Business_ListJobPostDTO> listAllBusiness = getJobPostsOfBusinesses();
        List<Business> listSuggestedBusiness = new ArrayList<>();
        List<Business_SuggestScoreDTO> listSuggestedBusinessWithScore = new ArrayList<>();
        for (int i = 0; i < listAllBusiness.size(); i++) {
            if (!listAllBusiness.get(i).getBusiness().getBusiness_eng_name().equals(student.getOption1()) &&
                    !listAllBusiness.get(i).getBusiness().getBusiness_eng_name().equals(student.getOption2())) {
                List<Job_Post> job_postList = listAllBusiness.get(i).getJob_postList();
                if (job_postList != null) {
                    for (int j = 0; j < job_postList.size(); j++) {
                        int matchFlag = 0;
                        for (int k = 0; k < job_postList.get(j).getJob_post_skills().size(); k++) {
                            List<Job_Post_Skill> job_post_skillList = job_postList.get(j).getJob_post_skills();
                            for (int l = 0; l < student.getSkills().size(); l++) {
                                if (student.getSkills().get(l) == job_post_skillList.get(k).getSkill()) {
                                    matchFlag++;
                                }
                            }
                        }
                        //(float)matchFlag / job_postList.get(j).getJob_post_skills().size() > 0.5
                        if (matchFlag > 0) {
                            Business_SuggestScoreDTO business_suggestScoreDTO = new Business_SuggestScoreDTO();
                            business_suggestScoreDTO.setBusiness(listAllBusiness.get(i).getBusiness());
                            business_suggestScoreDTO.setSuggestScore((float) matchFlag / job_postList.get(j).getJob_post_skills().size());
                            int isSet = -1;
                            for (int l = 0; l < listSuggestedBusinessWithScore.size(); l++) {
                                if (listSuggestedBusinessWithScore.get(l).getBusiness().getBusiness_eng_name().equals(business_suggestScoreDTO.getBusiness().getBusiness_eng_name())) {
                                    isSet = l;
                                }
                            }
                            if (isSet == -1) {
                                listSuggestedBusinessWithScore.add(business_suggestScoreDTO);
                            } else {
                                listSuggestedBusinessWithScore.get(isSet).setSuggestScore(business_suggestScoreDTO.getSuggestScore());
                            }
                        }
                    }
                }
            }
        }
        for (int i = 0; i < listSuggestedBusinessWithScore.size(); i++) {
            for (int j = i; j < listSuggestedBusinessWithScore.size(); j++) {
                if (listSuggestedBusinessWithScore.get(i).getSuggestScore() < listSuggestedBusinessWithScore.get(j).getSuggestScore()) {
                    Business_SuggestScoreDTO tmpBusiness_suggestScoreDTO = listSuggestedBusinessWithScore.get(i);
                    listSuggestedBusinessWithScore.set(i, listSuggestedBusinessWithScore.get(j));
                    listSuggestedBusinessWithScore.set(j, tmpBusiness_suggestScoreDTO);
                }
            }
        }
        for (int i = 0; i < listSuggestedBusinessWithScore.size(); i++) {
            for (int j = i; j < listSuggestedBusinessWithScore.size(); j++) {
                if (listSuggestedBusinessWithScore.get(i).getSuggestScore() == listSuggestedBusinessWithScore.get(j).getSuggestScore() &&
                        listSuggestedBusinessWithScore.get(i).getBusiness().getRateAverage() < listSuggestedBusinessWithScore.get(j).getBusiness().getRateAverage()) {
                    Business_SuggestScoreDTO tmpBusiness_suggestScoreDTO = listSuggestedBusinessWithScore.get(i);
                    listSuggestedBusinessWithScore.set(i, listSuggestedBusinessWithScore.get(j));
                    listSuggestedBusinessWithScore.set(j, tmpBusiness_suggestScoreDTO);
                }
            }
        }
        for (int i = 0; i < listSuggestedBusinessWithScore.size(); i++) {
            for (int j = i; j < listSuggestedBusinessWithScore.size(); j++) {
                if (listSuggestedBusinessWithScore.get(i).getSuggestScore() == listSuggestedBusinessWithScore.get(j).getSuggestScore() &&
                        listSuggestedBusinessWithScore.get(i).getBusiness().getRateAverage() == listSuggestedBusinessWithScore.get(j).getBusiness().getRateAverage() &&
                        listSuggestedBusinessWithScore.get(i).getBusiness().getRateCount() < listSuggestedBusinessWithScore.get(j).getBusiness().getRateCount()) {
                    Business_SuggestScoreDTO tmpBusiness_suggestScoreDTO = listSuggestedBusinessWithScore.get(i);
                    listSuggestedBusinessWithScore.set(i, listSuggestedBusinessWithScore.get(j));
                    listSuggestedBusinessWithScore.set(j, tmpBusiness_suggestScoreDTO);
                }
            }
        }
        for (int i = 0; i < listSuggestedBusinessWithScore.size(); i++) {
            listSuggestedBusiness.add(listSuggestedBusinessWithScore.get(i).getBusiness());
        }
        return listSuggestedBusiness;
    }


    //get business has job_post in specific specialized
    @Override
    public List<Business> filterListBusinessByStudentSpecialized(int specializedId, List<Business> businessList) {
        List<Business> finalList = new ArrayList<>();
        for (int i = 0; i < businessList.size(); i++) {
            Semester currentSemester = semesterService.getSemesterCurrent();
            Ojt_Enrollment ojt_enrollment = ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(businessList.get(i).getEmail(), currentSemester.getId());
            List<Job_Post> job_postList = job_postService.getAllJobPostOfBusiness(ojt_enrollment);
            for (int j = 0; j < job_postList.size(); j++) {
                for (int k = 0; k < job_postList.get(j).getJob_post_skills().size(); k++) {
                    if (job_postList.get(j).getJob_post_skills().get(k).getSkill().getSpecialized().getId() == specializedId) {
                        if (!finalList.contains(businessList.get(i))) {
                            finalList.add(businessList.get(i));
                        }
                    }
                }
            }
        }
        return finalList;
    }

    @Override
    public Businesses_OptionsDTO getBusinesses_OptionDTO() {
        List<Business> businessList = businessService.getAllBusinessBySemester();

        List<String> businessListEngName = new ArrayList<>();

        List<Integer> countStudentRegisterBusiness = new ArrayList<>();
        for (int i = 0; i < businessList.size(); i++) {
            Business business = businessList.get(i);
            String engNameOfBusiness = business.getBusiness_eng_name();

            businessListEngName.add(engNameOfBusiness);
            List<Student> studentListByBusinessName =
                    iStudentService.findStudentByBusinessNameOption(engNameOfBusiness, engNameOfBusiness);
            Integer sizeOfStudentListByBusinessName = studentListByBusinessName.size();
            countStudentRegisterBusiness.add(sizeOfStudentListByBusinessName);
        }

        Businesses_OptionsDTO businesses_optionsDTO = new Businesses_OptionsDTO();
        businesses_optionsDTO.setBusinessListEngName(businessListEngName);
        businesses_optionsDTO.setCountStudentRegisterBusiness(countStudentRegisterBusiness);

        return businesses_optionsDTO;
    }

    @Override
    public Businesses_StudentsDTO getBusinesses_StudentsDTO() {

        Semester semester = semesterService.getSemesterCurrent();

        List<Business> businessList = businessService.getAllBusinessBySemester();

        List<Integer> countStudentInternAtBusiness = new ArrayList<>();

        List<String> businessListEngName = new ArrayList<>();

        for (int i = 0; i < businessList.size(); i++) {
            String email = businessList.get(i).getEmail();
            int id = semester.getId();

            String engName = businessList.get(i).getBusiness_eng_name();
            businessListEngName.add(engName);

            int countBusiness = ojt_enrollmentService.countOjt_EnrollmentsByBusinessEmailAndSemesterIdAndStudentEmailNotNull(email, id);
            countStudentInternAtBusiness.add(countBusiness);
        }
        Businesses_StudentsDTO businesses_studentsDTO = new Businesses_StudentsDTO();
        businesses_studentsDTO.setBusinessListEngName(businessListEngName);
        businesses_studentsDTO.setNumberOfStudentInternAtBusiness(countStudentInternAtBusiness);

        return businesses_studentsDTO;
    }

    @Override
    public List<Statistical_EvaluationDTO> getListStatistical_EvaluationDTO() {

        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_1 = null;
        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_2 = null;
        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_3 = null;
        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_4 = null;

        List<Statistical_EvaluationDTO> statisticalEvaluationDTOList = new ArrayList<>();


        List<Evaluation> evaluationListReport_1 = iEvaluationService.getEvaluationsByTitle(ReportName.EVALUATION1);
        if (evaluationListReport_1.size() != 0) {
            statistical_evaluationDTOEvaluation_1 = statistical_evaluationDTO(evaluationListReport_1);
            if (statistical_evaluationDTOEvaluation_1 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_1);
            }
        }


        List<Evaluation> evaluationListReport_2 = iEvaluationService.getEvaluationsByTitle(ReportName.EVALUATION2);
        if (evaluationListReport_2.size() != 0) {
            statistical_evaluationDTOEvaluation_2 = statistical_evaluationDTO(evaluationListReport_2);
            if (statistical_evaluationDTOEvaluation_2 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_2);
            }
        }

        List<Evaluation> evaluationListReport_3 = iEvaluationService.getEvaluationsByTitle(ReportName.EVALUATION3);
        if (evaluationListReport_3.size() != 0) {

            statistical_evaluationDTOEvaluation_3 = statistical_evaluationDTO(evaluationListReport_3);
            if (statistical_evaluationDTOEvaluation_3 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_3);
            }
        }
        List<Evaluation> evaluationListReport_4 = iEvaluationService.getEvaluationsByTitle(ReportName.EVALUATION4);
        if (evaluationListReport_4.size() != 0) {
            statistical_evaluationDTOEvaluation_4 = statistical_evaluationDTO(evaluationListReport_4);
            if (statistical_evaluationDTOEvaluation_4 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_4);
            }
        }

        if (statisticalEvaluationDTOList.size() == 0) {
            return null;
        }

        return statisticalEvaluationDTOList;
    }


    public List<String> getListOtherOfQuestion(List<Answer> answers) {
        List<String> others = new ArrayList<>();
        for (int i = 0; i < answers.size(); i++) {
            String content = answers.get(i).getContent();
            others.add(content);
        }
        return others;
    }

    public List<Integer> countAnswerOfQuestion(Question question) {
        List<Integer> countAnswer = new ArrayList<>();

        List<Answer> answers = question.getAnswers();
        for (int i = 0; i < answers.size(); i++) {
            Answer answer = answers.get(i);
            int resultStudentAnswer = iStudent_answerService.countStudentsAnswerByAnswerId(answer.getId());
            countAnswer.add(resultStudentAnswer);
        }
        return countAnswer;
    }

    public Statistical_EvaluationDTO statistical_evaluationDTO(List<Evaluation> evaluationListByName) {
        int countExcellent = 0;
        int countGood = 0;
        int countMiddling = 0;
        int countMedium = 0;
        int countLeast = 0;

        for (int i = 0; i < evaluationListByName.size(); i++) {
            Evaluation evaluation = evaluationListByName.get(i);

            double scoreActivity = evaluation.getScore_activity();
            double scoreDiscipline = evaluation.getScore_discipline();
            double scoreWork = evaluation.getScore_work();

            ReportType reportType = typeOfEvaluation(scoreActivity, scoreDiscipline, scoreWork);
            if (reportType == ReportType.Excellent) {
                countExcellent++;
            } else if (reportType == ReportType.Good) {
                countGood++;
            } else if (reportType == ReportType.Middling) {
                countMiddling++;
            } else if (reportType == ReportType.Medium) {
                countMedium++;
            } else if (reportType == ReportType.Least) {
                countLeast++;
            }
        }
        Statistical_EvaluationDTO statistical_evaluationDTO = new Statistical_EvaluationDTO();

        ReportName reportName = evaluationListByName.get(0).getTitle();

        List<Integer> percentTypeByNameReport = new ArrayList<>();
        percentTypeByNameReport.add(countExcellent);
        percentTypeByNameReport.add(countGood);
        percentTypeByNameReport.add(countMiddling);
        percentTypeByNameReport.add(countMedium);
        percentTypeByNameReport.add(countLeast);

        statistical_evaluationDTO.setEvaluationName(String.valueOf(reportName));
        statistical_evaluationDTO.setStatisticalTypeEvaluation(percentTypeByNameReport);

        return statistical_evaluationDTO;
    }

    public ReportType typeOfEvaluation(double scoreActivity, double scoreDiscipline, double scoreWork) {
        double ave = (scoreActivity + scoreDiscipline + scoreWork) / 3;
        if (ave > 9) {
            return ReportType.Excellent;
        } else if (ave <= 9 && ave > 8) {
            return ReportType.Good;
        } else if (ave <= 8 && ave > 7) {
            return ReportType.Middling;
        } else if (ave <= 7 && ave >= 5) {
            return ReportType.Medium;
        } else {
            return ReportType.Least;
        }
    }


    @Override
    public List<StatisticalQuestionAnswerDTO> getListStatisticalQuestionAnswerDTO() {
        List<StatisticalQuestionAnswerDTO> statisticalQuestionAnswerDTOS = new ArrayList<>();

        List<Question> questions = iQuestionService.getAllQuestion();

        StatisticalQuestionAnswerDTO statisticalQuestionAnswerDTO = new StatisticalQuestionAnswerDTO();

        List<Integer> countAnswer;

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            List<String> answerStringList = new ArrayList<>();
            List<Answer> answer = question.getAnswers();

            for (int j = 0; j < answer.size(); j++) {
                answerStringList.add(answer.get(j).getContent());
            }

            statisticalQuestionAnswerDTO.setQuestion(question.getContent());
            statisticalQuestionAnswerDTO.setAnswers(answerStringList);
            statisticalQuestionAnswerDTO.setManyOption(question.isManyOption());

            countAnswer = countAnswerOfQuestion(question);
            statisticalQuestionAnswerDTO.setCountAnswer(countAnswer);

            List<Answer> answers = iAnswerService.findAnswerByOtherIsTrueAndQuestionId(question.getId());
            List<String> others = getListOtherOfQuestion(answers);

            statisticalQuestionAnswerDTO.setOthers(others);

            statisticalQuestionAnswerDTOS.add(statisticalQuestionAnswerDTO);

            statisticalQuestionAnswerDTO = new StatisticalQuestionAnswerDTO();
        }

        return statisticalQuestionAnswerDTOS;
    }

    @Override
    public List<Integer> percentStudentMakeSurvey() {
        int studentsSize = iStudentService.getAllStudentsBySemesterId().size();

        int studentIsAnswer = iStudent_answerService.countStudent_AnswersGroupByStudentEmail();

        List<Integer> percentStudentIsAnswer = new ArrayList<>();
        percentStudentIsAnswer.add(studentIsAnswer);
        percentStudentIsAnswer.add(studentsSize - studentIsAnswer);

        return percentStudentIsAnswer;
    }

    @Override
    public BusinessOptionsBySemesterDTO getBusinessOptionsBySemester(String businessEmail) {
        String semesterName;

        List<String> listSemesterName = new ArrayList<>();
        List<Integer> countOptions = new ArrayList<>();

        BusinessOptionsBySemesterDTO businessOptionsBySemesterDTO = new BusinessOptionsBySemesterDTO();

        Business business = businessService.getBusinessByEmail(businessEmail);

        List<Semester> semesters = iSemesterService.getAllSemester();
        for (int i = 0; i < semesters.size(); i++) {
            semesterName = semesters.get(i).getName();
            listSemesterName.add(semesterName);
            List<Ojt_Enrollment> ojt_enrollmentList =
                    ojt_enrollmentService.getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(semesters.get(i).getId());

            int count = countOptionOfBusinessBySemester(ojt_enrollmentList, business.getBusiness_eng_name());
            countOptions.add(count);
        }
        businessOptionsBySemesterDTO.setSemester(listSemesterName);
        businessOptionsBySemesterDTO.setCountStudentRegisterBusiness(countOptions);

        return businessOptionsBySemesterDTO;
    }

    @Override
    public BusinessOptionsBySemesterDTO countStudentInternAtBusinessBySemester(String businessEmail) {
        String semesterName;

        List<String> listSemesterName = new ArrayList<>();
        List<Integer> countOptions = new ArrayList<>();

        BusinessOptionsBySemesterDTO businessOptionsBySemesterDTO = new BusinessOptionsBySemesterDTO();

        List<Semester> semesters = iSemesterService.getAllSemester();
        for (int i = 0; i < semesters.size(); i++) {
            semesterName = semesters.get(i).getName();
            listSemesterName.add(semesterName);
            List<Ojt_Enrollment> ojt_enrollmentList =
                    ojt_enrollmentService.getOjt_EnrollmentsBySemesterIdAndStudentEmailNotNull(semesters.get(i).getId());

            int count = countStudentInternAtBusinessBySemester(ojt_enrollmentList, businessEmail);
            countOptions.add(count);
        }
        businessOptionsBySemesterDTO.setSemester(listSemesterName);
        businessOptionsBySemesterDTO.setCountStudentRegisterBusiness(countOptions);

        return businessOptionsBySemesterDTO;
    }

    @Override
    public List<Statistical_EvaluationDTO> getListStatistical_EvaluationDTOOfABusiness(String email) {

        List<Evaluation> evaluationList = iEvaluationService.getEvaluationsByBusinessEmail(email);


        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_1;
        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_2;
        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_3;
        Statistical_EvaluationDTO statistical_evaluationDTOEvaluation_4;

        List<Evaluation> evaluationListByTitle_1=getEvaluationByTitle(evaluationList,ReportName.EVALUATION1);
        List<Evaluation> evaluationListByTitle_2=getEvaluationByTitle(evaluationList,ReportName.EVALUATION2);
        List<Evaluation> evaluationListByTitle_3=getEvaluationByTitle(evaluationList,ReportName.EVALUATION3);
        List<Evaluation> evaluationListByTitle_4=getEvaluationByTitle(evaluationList,ReportName.EVALUATION4);

        List<Statistical_EvaluationDTO> statisticalEvaluationDTOList = new ArrayList<>();


        if (evaluationListByTitle_1.size() != 0) {
            statistical_evaluationDTOEvaluation_1 = statistical_evaluationDTO(evaluationListByTitle_1);
            if (statistical_evaluationDTOEvaluation_1 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_1);
            }
        }

        if (evaluationListByTitle_2.size() != 0) {
            statistical_evaluationDTOEvaluation_2 = statistical_evaluationDTO(evaluationListByTitle_2);
            if (statistical_evaluationDTOEvaluation_2 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_2);
            }
        }
        if (evaluationListByTitle_3.size() != 0) {
            statistical_evaluationDTOEvaluation_3 = statistical_evaluationDTO(evaluationListByTitle_3);
            if (statistical_evaluationDTOEvaluation_3 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_3);
            }
        }
        if (evaluationListByTitle_4.size() != 0) {
            statistical_evaluationDTOEvaluation_4 = statistical_evaluationDTO(evaluationListByTitle_4);
            if (statistical_evaluationDTOEvaluation_4 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOEvaluation_4);
            }
        }

        return statisticalEvaluationDTOList;
    }

    public List<Evaluation> getEvaluationByTitle(List<Evaluation> evaluationList, ReportName title) {
        List<Evaluation> evaluationListByTitle = new ArrayList<>();
        for (int i = 0; i < evaluationList.size(); i++) {
            Evaluation evaluation = evaluationList.get(i);
            if(evaluation.getTitle().equals(title)){
                evaluationListByTitle.add(evaluation);
            }
        }
        return evaluationListByTitle;
    }


    public int countStudentInternAtBusinessBySemester(List<Ojt_Enrollment> ojt_enrollments, String email) {
        int count = 0;
        for (int i = 0; i < ojt_enrollments.size(); i++) {
            Business business = ojt_enrollments.get(i).getBusiness();
            if (business != null) {
                if (business.getEmail().equals(email)) {
                    count++;
                }
            }
        }
        return count;
    }

    public int countOptionOfBusinessBySemester(List<Ojt_Enrollment> ojt_enrollments, String businessEngName) {
        Student student;
        int count = 0;
        String option1 = "";
        String option2 = "";

        for (int i = 0; i < ojt_enrollments.size(); i++) {
            student = ojt_enrollments.get(i).getStudent();
            if (student.getOption1() != null) {
                option1 = student.getOption1();
            }
            if (student.getOption2() != null) {
                option2 = student.getOption2();
            }
            if (option1.equals(businessEngName) || option2.equals(businessEngName)) {
                count++;
            }
        }
        return count;
    }
}
