package com.example.demo.service;

import com.example.demo.entity.Account;
import com.example.demo.entity.Role;
import com.example.demo.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Repository;

import javax.mail.internet.MimeMessage;
import java.util.List;
import java.util.Set;

@Repository
public class AccountService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    private JavaMailSender sender;

    public boolean addListStudent(List<Account> accountList) {
        accountRepository.saveAll(accountList);
        return true;
    }

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

    public Account findAccountStudentByEmailAndPassword(String email, String password, String role) {
        //Account account = accountRepository.findAccountByEmailAndPassword(email, password);
        Account account = accountRepository.findAccountStudentCustom(email, password, role);
        if (account != null) {
            return account;
        }
        return null;
    }

    public Account findAccountByEmail(String email) {
        //Account account = accountRepository.findAccountByEmailAndPassword(email, password);
        Account account = accountRepository.findAccountByEmail(email);
        if (account != null) {
            return account;
        }
        return null;
    }

}
