package com.bac.se.backend.utils;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadImage {
    private final Cloudinary cloudinaryConfig;


    public String uploadFile(MultipartFile gif) {
        try {
            File uploadedFile = convertMultiPartToFile(gif);
            var uploadResult = cloudinaryConfig
                    .uploader().upload(uploadedFile, ObjectUtils.emptyMap());
            // delete the temporary file optimized for memory
            Files.delete(uploadedFile.toPath());
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    File convertMultiPartToFile(MultipartFile file) {
        try {
            if (!Objects.requireNonNull(FilenameUtils.getExtension(file.getOriginalFilename())).equalsIgnoreCase("jpg")
                    && !FilenameUtils.getExtension(file.getOriginalFilename()).equalsIgnoreCase("png")) {
                throw new RuntimeException("Only jpg and png files are allowed");
            }
            File convFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
            FileOutputStream fos = null;
            fos = new FileOutputStream(convFile);
            fos.write(file.getBytes());
            fos.close();
            return convFile;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
