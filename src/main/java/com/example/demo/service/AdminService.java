package com.example.demo.service;

import com.example.demo.dto.Business_ListJobPostDTO;
import com.example.demo.dto.Business_SuggestScoreDTO;
import com.example.demo.dto.Businesses_OptionsDTO;
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

    @Override
    public Admin findAdminByEmail(String email) {
        Admin admin = IAdminRepository.findAdminByEmail(email);
        if (admin != null) {
            return admin;
        }
        return null;
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

        List<Integer> countStudentRegisterBusiness=new ArrayList<>();
        for (int i = 0; i < businessList.size(); i++) {
            Business business = businessList.get(i);
            String engNameOfBusiness=business.getBusiness_eng_name();

            List<Student> studentListByBusinessName=
                    iStudentService.findStudentByBusinessNameOption(engNameOfBusiness,engNameOfBusiness);
            Integer sizeOfStudentListByBusinessName=studentListByBusinessName.size();
            countStudentRegisterBusiness.add(sizeOfStudentListByBusinessName);
        }

        Businesses_OptionsDTO businesses_optionsDTO=new Businesses_OptionsDTO();
        businesses_optionsDTO.setBusinessList(businessList);
        businesses_optionsDTO.setCountStudentRegisterBusiness(countStudentRegisterBusiness);

        return businesses_optionsDTO;
    }
}
