package com.sop.financialcontrol;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.Contact;

/**
 * Main application class for the SOP Financial Control System.
 */
@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "SOP Financial Control API",
        version = "1.0",
        description = "API for managing expenses, commitments, and payments for SOP",
        contact = @Contact(name = "SOP IT Department", email = "it@sop.com")
    )
)
public class FinancialControlApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinancialControlApplication.class, args);
    }
}