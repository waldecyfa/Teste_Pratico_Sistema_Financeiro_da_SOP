package com.sop.financialcontrol.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sop.financialcontrol.model.ExpenseStatus;
import com.sop.financialcontrol.model.ExpenseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for transferring Expense data between client and server.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {

    private Long id;

    @NotBlank(message = "Protocol number is required")
    private String protocolNumber;

    @NotNull(message = "Expense type is required")
    private ExpenseType expenseType;

    @NotNull(message = "Protocol date is required")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime protocolDate;

    @NotNull(message = "Due date is required")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dueDate;

    @NotBlank(message = "Creditor is required")
    private String creditor;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private ExpenseStatus status;

    // Additional fields for summary information
    private BigDecimal totalCommittedAmount;
    private BigDecimal totalPaidAmount;
    private BigDecimal remainingAmount;
    private int commitmentCount;
}