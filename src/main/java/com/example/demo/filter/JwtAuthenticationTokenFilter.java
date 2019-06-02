package com.example.demo.filter;

import com.example.demo.entity.Account;
import com.example.demo.service.AccountService;
import com.example.demo.service.JwtService;
import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

public class JwtAuthenticationTokenFilter extends UsernamePasswordAuthenticationFilter {

    private final static String TOKEN_HEADER = "Authorization";

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AccountService accountService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
//        try {
            String authToken = httpRequest.getHeader(TOKEN_HEADER);
//            String authToken = null;
//            if (!httpRequest.getRequestURI().contains("login")) {
//                Cookie[] cookies = httpRequest.getCookies();
//                for (Cookie cookie : cookies) {
//                    if (cookie.getName().equals("id_token")) {
//                        authToken = cookie.getValue();
//                    }
//                }
//            }

            System.out.println("Token " + httpRequest.getMethod() + " " + authToken);

            if (httpRequest.getMethod().equals("OPTIONS")) {
                httpServletResponse.setStatus(200);
                return;
            }

            if (jwtService.validateTokenLogin(authToken)) {
                String email = jwtService.getEmailFromToken(authToken);

                Account account = accountService.findAccountByEmail(email);
                if (account != null) {
                    boolean enabled = true;
                    boolean accountNonExpired = true;
                    boolean credentialsNonExpired = true;
                    boolean accountNonLocked = true;
                    UserDetails userDetail = new User(account.getEmail(), account.getPassword(), enabled, accountNonExpired,
                            credentialsNonExpired, accountNonLocked, account.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetail,
                            null, userDetail.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
//            else {
//                httpServletResponse.setStatus(401);
//                return;
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            httpServletResponse.setStatus(401);
//            return;
//        }

        chain.doFilter(request, response);
    }
}
