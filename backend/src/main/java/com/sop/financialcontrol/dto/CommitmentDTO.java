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
 * DTO for transferring Commitment data between client and server.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitmentDTO {

    private Long id;

    @NotBlank(message = "Commitment number is required")
    private String commitmentNumber;

    @NotNull(message = "Commitment date is required")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate commitmentDate;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String note;

    @NotNull(message = "Expense ID is required")
    private Long expenseId;

    // Additional fields for reference
    private String expenseProtocolNumber;
    private BigDecimal expenseAmount;
    
    // Additional fields for summary information
    private BigDecimal totalPaidAmount;
    private BigDecimal remainingAmount;
    private int paymentCount;
}