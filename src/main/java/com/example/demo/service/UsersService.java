package com.example.demo.service;

import com.example.demo.entity.Users;
import com.example.demo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Repository;

import javax.mail.internet.MimeMessage;

@Repository
public class UsersService {
    @Autowired
    UsersRepository usersRepository;

    @Autowired
    private JavaMailSender sender;


    public void sendEmail(String name, String mail) throws Exception {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        String password = getAlphaNumericString(7);

        helper.setTo(mail);
        helper.setText("Hi " + name + ",\n" + "welcome you to my system.\n Your password are : " + password + "\nThanks and Regards");
        helper.setSubject("[TEST EOJTs]");

        sender.send(message);
    }

    private String getAlphaNumericString(int size) {
        String AlphaNumericString = "0123456789"
                + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "abcdefghijklmnopqrstuvxyz";
        StringBuilder sb = new StringBuilder(size);

        for (int i = 0; i < size; i++) {
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

    public Users findUserByEmailAndPassWord(String email,String password) {
        Users users = usersRepository.findUserByEmailAndPassword(email,password);
        if (users != null) {
            return users;
        }
        return null;
    }
}
