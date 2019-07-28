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

        Statistical_EvaluationDTO statistical_evaluationDTOReport_1 = null;
        Statistical_EvaluationDTO statistical_evaluationDTOReport_2 = null;
        Statistical_EvaluationDTO statistical_evaluationDTOReport_3 = null;
        Statistical_EvaluationDTO statistical_evaluationDTOReport_4 = null;

        List<Statistical_EvaluationDTO> statisticalEvaluationDTOList = new ArrayList<>();

        List<Evaluation> evaluationListReport_1 = iEvaluationService.getEvaluationsByTitle(ReportName.REPORT1);
        if (evaluationListReport_1 != null) {
            statistical_evaluationDTOReport_1 = statistical_evaluationDTO(evaluationListReport_1);
            if (statistical_evaluationDTOReport_1 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOReport_1);
            }
        }
        List<Evaluation> evaluationListReport_2 = iEvaluationService.getEvaluationsByTitle(ReportName.REPORT2);
        if (evaluationListReport_2 != null) {
            statistical_evaluationDTOReport_2 = statistical_evaluationDTO(evaluationListReport_2);
            if (statistical_evaluationDTOReport_2 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOReport_2);
            }
        }
        List<Evaluation> evaluationListReport_3 = iEvaluationService.getEvaluationsByTitle(ReportName.REPORT3);
        if (evaluationListReport_3 != null) {
            statistical_evaluationDTOReport_3 = statistical_evaluationDTO(evaluationListReport_3);
            if (statistical_evaluationDTOReport_3 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOReport_3);
            }
        }
        List<Evaluation> evaluationListReport_4 = iEvaluationService.getEvaluationsByTitle(ReportName.REPORT4);
        if (evaluationListReport_4 != null) {
            statistical_evaluationDTOReport_4 = statistical_evaluationDTO(evaluationListReport_4);
            if (statistical_evaluationDTOReport_4 != null) {
                statisticalEvaluationDTOList.add(statistical_evaluationDTOReport_4);
            }
        }

        return statisticalEvaluationDTOList;
    }

    @Override
    public List<StatisticalQuestionAnswerDTO> getListStatisticalQuestionAnswerDTO() {
        List<StatisticalQuestionAnswerDTO> statisticalQuestionAnswerDTOS = new ArrayList<>();

        List<Question> questions = iQuestionService.getAllQuestion();

        StatisticalQuestionAnswerDTO statisticalQuestionAnswerDTO = new StatisticalQuestionAnswerDTO();

        List<Integer> countAnswer;

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            statisticalQuestionAnswerDTO.setQuestion(question.getContent());
            statisticalQuestionAnswerDTO.setAnswers(question.getAnswers());
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
}
