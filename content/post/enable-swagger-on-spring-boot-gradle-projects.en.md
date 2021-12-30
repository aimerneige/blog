---
title: "Enable Swagger on Spring Boot Gradle Projects"
date: 2021-12-30T15:35:21+08:00
draft: false
ShowToc: true
categories: [Development]
tags: [java,swagger,spring]
cover:
    image: "images/spring_swagger.svg"
    alt: "Spring Swagger"
    relative: false
---

# Adding Swagger to Spring Boot

1. Getting the Swagger Spring dependency
2. Enabling Swagger in your code
3. Configuring Swagger
4. Adding details as annotations to APIs

## Getting the Swagger Spring dependency

Edit `build.gradle`

```
plugins {
	id 'org.springframework.boot' version '2.5.2'
	...
}

...

dependencies {
    implementation "io.springfox:springfox-boot-starter:3.0.0"
    ...
}
```

## Enabling Swagger in your code

Add `@EnableSwagger2` to SpringBootApplication

## Configuring Swagger

Create `SwaggerConfig` class.

```java
package com.aimerneige.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket apiDocket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.aimerneige.example.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Example API")
                .version("1.0")
                .build();
    }
}
```

## Adding details as annotations to APIs

Add annotation to your controller.
