package com.example.demo.controller;

import com.example.demo.entity.Student;
import com.example.demo.service.FileStorageService;
import com.example.demo.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;


@RestController
@RequestMapping("/api/file")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private StudentService studentService;

    @PostMapping("/uploadFile")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        String emailStudent = getEmailFromToken();

        boolean updateLinkResume = studentService.updateLinkFileResumeForStudent(emailStudent, fileName);

        if (updateLinkResume == false) {
            return new ResponseEntity<String>("fail", HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @GetMapping("/downloadFile")
    public ResponseEntity<Resource> downloadFile(HttpServletRequest request, @RequestParam String emailStudent) {
        // Load file as Resource
        Student student = studentService.getStudentByEmail(emailStudent);
        if (student != null) {
            Resource resource = fileStorageService.loadFileAsResource(student.getResumeLink());

            // Try to determine file's content type
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                logger.info("Could not determine file type.");
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }
        return null;
    }


    //get email from token
    private String getEmailFromToken() {
        String email = "";
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return email;
    }

    public class UploadFileResponse {
        private String fileName;
        private String fileDownloadUri;
        private String fileType;
        private long size;

        public UploadFileResponse(String fileName, String fileDownloadUri, String fileType, long size) {
            this.fileName = fileName;
            this.fileDownloadUri = fileDownloadUri;
            this.fileType = fileType;
            this.size = size;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getFileDownloadUri() {
            return fileDownloadUri;
        }

        public void setFileDownloadUri(String fileDownloadUri) {
            this.fileDownloadUri = fileDownloadUri;
        }

        public String getFileType() {
            return fileType;
        }

        public void setFileType(String fileType) {
            this.fileType = fileType;
        }

        public long getSize() {
            return size;
        }

        public void setSize(long size) {
            this.size = size;
        }
    }
}