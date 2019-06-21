package com.example.demo.controller;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.StudentDTO;
import com.example.demo.entity.Student;
import com.example.demo.entity.Users;
import com.example.demo.service.JwtService;
import com.example.demo.service.StudentService;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/account")
public class WebController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StudentService studentService;


    @GetMapping("")
    public String hello() {
        return "hello";
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
                result = jwtService.generateTokenLogin(usersFound.getEmail(), usersFound.getRoles().get(0).getDescription());

                login.setUser(usersFound);
                login.setToken(result);

                for (int i = 0; i < usersFound.getRoles().size(); i++) {
                    String name = usersFound.getRoles().get(i).getDescription();
                    if (name.equals("ROLE_STUDENT")) {
                        Student student = studentService.getStudentByEmail(users.getEmail());
                        StudentDTO studentDTO = new StudentDTO();
                        studentDTO.convertFromStudentEntity(student);
                        login.setStudent(studentDTO);
                    }
                }

                httpStatus = HttpStatus.OK;
            } else {
                httpStatus = HttpStatus.BAD_REQUEST;
            }
        } catch (Exception ex) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<LoginDTO>(login, httpStatus);
    }
}
