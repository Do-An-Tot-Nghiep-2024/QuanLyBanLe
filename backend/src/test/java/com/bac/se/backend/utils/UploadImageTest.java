package com.bac.se.backend.utils;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;

class UploadImageTest {


    @InjectMocks
    private UploadImage uploadImage;

    @Mock
    private Cloudinary cloudinaryConfig;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void uploadFile() throws IOException {

    }
}