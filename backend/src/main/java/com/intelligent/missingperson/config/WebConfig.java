package com.intelligent.missingperson.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This makes files in the './uploads/' directory accessible via the '/uploads/**' URL path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }
}