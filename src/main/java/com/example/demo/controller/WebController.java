package com.example.demo.controller;

import com.example.demo.dto.LoginDTO;
import com.example.demo.entity.Business;
import com.example.demo.entity.Specialized;
import com.example.demo.entity.Student;
import com.example.demo.entity.Users;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.PersistenceException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/api/account")
public class WebController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SpecializedService specializedService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private BusinessService businessService;

    @PostMapping("")
    public ResponseEntity<Void> addListUser(@RequestBody List<Users> listUsers) throws Exception {

        try {


//        for (int i = 0; i < account.size(); i++) {
//            accountService.sendEmail(account.get(i).getName(), account.get(i).getEmail());
//        }

        } catch (PersistenceException ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/token")
    public ResponseEntity<LoginDTO> checkLogin(HttpServletRequest request, @RequestBody Users users, HttpServletResponse response) {
        String result = "";
        HttpStatus httpStatus = null;
        boolean check;
        Users usersFound = new Users();
        LoginDTO login = new LoginDTO();
        try {
            check = false;
            if (usersService.findUserByEmailAndPassWord(users.getEmail(), users.getPassword()) != null) {
                usersFound = usersService.findUserByEmailAndPassWord(users.getEmail(), users.getPassword());
                result = jwtService.generateTokenLogin(usersFound.getEmail());

                login.setUser(usersFound);
                login.setToken(result);
                httpStatus = HttpStatus.OK;
            } else {
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        } catch (Exception ex) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<LoginDTO>(login, httpStatus);
    }

    //get list skill by specialzed
    @GetMapping("/specialized")
    public ResponseEntity<List<Specialized>> getSpecializedList() {
        return new ResponseEntity<List<Specialized>>(specializedService.getAllSpecialized(), HttpStatus.OK);
    }

    //get student by email
    @GetMapping("student/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return new ResponseEntity<Student>(studentService.getStudentByEmail(email), HttpStatus.OK);
    }

    @PostMapping("/business/import")
    public ResponseEntity<Void> importFileBusiness(@RequestBody List<Business> listBusiness) {
        System.out.println(listBusiness.get(0).getOjt_enrollments().get(0).getBusiness().getEmail());
        businessService.importFileBusiness(listBusiness);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
