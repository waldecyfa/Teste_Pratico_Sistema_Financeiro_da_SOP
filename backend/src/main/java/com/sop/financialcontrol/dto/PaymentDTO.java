package com.sop.financialcontrol.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for transferring Payment data between client and server.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {

    private Long id;

    @NotBlank(message = "Payment number is required")
    private String paymentNumber;

    @NotNull(message = "Payment date is required")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate paymentDate;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String note;

    @NotNull(message = "Commitment ID is required")
    private Long commitmentId;

    // Additional fields for reference
    private String commitmentNumber;
    private BigDecimal commitmentAmount;
    private Long expenseId;
    private String expenseProtocolNumber;
}