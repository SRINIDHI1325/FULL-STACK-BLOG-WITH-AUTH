package com.example.demo.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Blog API", version = "v1"))
public class OpenApiConfig {
    // Basic OpenAPI definition - springdoc will expose /swagger-ui/index.html
}
