package com.sop.financialcontrol.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing an Expense in the system.
 */
@Entity
@Table(name = "expenses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "protocol_number", unique = true, nullable = false)
    private String protocolNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "expense_type", nullable = false)
    private ExpenseType expenseType;

    @NotNull
    @Column(name = "protocol_date", nullable = false)
    private LocalDateTime protocolDate;

    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @NotBlank
    @Column(name = "creditor", nullable = false)
    private String creditor;

    @NotBlank
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Positive
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ExpenseStatus status;

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Commitment> commitments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Calculate the total committed amount for this expense.
     *
     * @return The sum of all commitment amounts
     */
    @Transient
    public BigDecimal getTotalCommittedAmount() {
        return commitments.stream()
                .map(Commitment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calculate the total paid amount for this expense.
     *
     * @return The sum of all payment amounts across all commitments
     */
    @Transient
    public BigDecimal getTotalPaidAmount() {
        return commitments.stream()
                .flatMap(commitment -> commitment.getPayments().stream())
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Update the status of the expense based on its commitments and payments.
     */
    public void updateStatus() {
        BigDecimal committedAmount = getTotalCommittedAmount();
        BigDecimal paidAmount = getTotalPaidAmount();

        if (commitments.isEmpty()) {
            this.status = ExpenseStatus.AWAITING_COMMITMENT;
        } else if (committedAmount.compareTo(amount) < 0) {
            this.status = ExpenseStatus.PARTIALLY_COMMITTED;
        } else if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.status = ExpenseStatus.AWAITING_PAYMENT;
        } else if (paidAmount.compareTo(amount) < 0) {
            this.status = ExpenseStatus.PARTIALLY_PAID;
        } else {
            this.status = ExpenseStatus.PAID;
        }
    }
}