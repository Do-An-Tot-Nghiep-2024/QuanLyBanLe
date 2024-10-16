package com.bac.se.backend.utils;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.cloudinary.utils.ObjectUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class UploadImageTest {
    @InjectMocks
    private UploadImage uploadImage;

    @Mock
    private Cloudinary cloudinaryConfig;

    @Mock
    private Uploader uploader;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(cloudinaryConfig.uploader()).thenReturn(uploader);
    }

    @Test
    void uploadFile() throws IOException {
        MockMultipartFile mockFile = new MockMultipartFile("file", "test.png", "image/png", "test data".getBytes());
        File tempFile = uploadImage.convertMultiPartToFile(mockFile);
        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "http://example.com/secure_url");
        when(uploader.upload(any(File.class), eq(ObjectUtils.emptyMap()))).thenReturn(uploadResult);

        // Act
        String result = uploadImage.uploadFile(mockFile);

        // Assert
        assertEquals("http://example.com/secure_url", result);

        // Clean up
        Files.deleteIfExists(tempFile.toPath());
    }
    @Test
    public void uploadFileDeletesTemporaryFileAfterUpload() throws Exception {
        // Arrange
        MockMultipartFile mockFile = new MockMultipartFile("file", "test.png", "image/png", "test data".getBytes());
        File tempFile = uploadImage.convertMultiPartToFile(mockFile);
        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "http://example.com/secure_url");
        when(uploader.upload(any(File.class), eq(ObjectUtils.emptyMap()))).thenReturn(uploadResult);

        // Act
        uploadImage.uploadFile(mockFile);

        // Assert
        assertFalse(Files.exists(tempFile.toPath()));
    }

    @Test
    public void uploadFileErrorDuringUploadThrowsRuntimeException() throws Exception {
        // Arrange
        MockMultipartFile mockFile = new MockMultipartFile("file", "test.png", "image/png", "test data".getBytes());
        when(uploader.upload(any(File.class), eq(ObjectUtils.emptyMap()))).thenThrow(new RuntimeException("Upload failed"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> uploadImage.uploadFile(mockFile));
    }
}