package com.example.demo.service;

import com.example.demo.entity.Role;
import com.example.demo.entity.Users;
import com.example.demo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.List;

@Service
public class UsersService {
    @Autowired
    UsersRepository usersRepository;

    @Autowired
    private JavaMailSender sender;

    @Autowired
    RoleService roleService;


    public void sendEmail(String name, String mail, String password) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setTo(mail);
        helper.setText("Hi " + name + ",\n" + "welcome you to my system.\n Your password are : " + password + "\nThanks and Regards");
        helper.setSubject("[TEST EOJTs]");

        sender.send(message);
    }

    public String getAlphaNumericString() {
        String AlphaNumericString = "0123456789"
                + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "abcdefghijklmnopqrstuvxyz";
        StringBuilder sb = new StringBuilder(7);

        for (int i = 0; i < 7; i++) {
            int index
                    = (int) (AlphaNumericString.length()
                    * Math.random());
            sb.append(AlphaNumericString
                    .charAt(index));
        }
        return sb.toString();
    }

    public Users findUserByEmail(String email) {
        Users users = usersRepository.findUserByEmail(email);
        if (users != null) {
            return users;
        }
        return null;
    }

    public Users findUserByEmailAndPassWord(String email, String password) {
        Users users = usersRepository.findUserByEmailAndPassword(email, password);
        if (users != null) {
            return users;
        }
        return null;
    }

    public boolean saveListUser(List<Users> usersList) {
        usersRepository.saveAll(usersList);
        return true;
    }

    public boolean saveUser(Users users) {
        usersRepository.save(users);
        return true;
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public boolean updatePasswordOfUserByEmail(String email, String password) {
        Users users = findUserByEmail(email);
        if (users != null) {
            users.setPassword(password);
            usersRepository.save(users);
            return true;
        }
        return false;
    }

    public boolean updateStatus(String email, boolean isActive) {
        Users users = usersRepository.findUserByEmail(email);
        if (users != null) {
            users.setActive(isActive);
            usersRepository.save(users);
            return true;
        }
        return false;
    }

    public List<Users> getAllUsersByType(int type) {
        Role role = roleService.findRoleById(type);
        List<Role> roleList=new ArrayList<>();
        roleList.add(role);

        List<Users> usersList=  usersRepository.findUsersByRoles(roleList);


        return usersList;
    }
}
