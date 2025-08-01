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
 * Entity representing a Commitment in the system.
 */
@Entity
@Table(name = "commitments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Commitment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "commitment_number", unique = true, nullable = false)
    private String commitmentNumber;

    @NotNull
    @Column(name = "commitment_date", nullable = false)
    private LocalDate commitmentDate;

    @NotNull
    @Positive
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "note")
    private String note;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @OneToMany(mappedBy = "commitment", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Payment> payments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Calculate the total paid amount for this commitment.
     *
     * @return The sum of all payment amounts
     */
    @Transient
    public BigDecimal getTotalPaidAmount() {
        return payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Check if this commitment has any associated payments.
     *
     * @return true if there are payments, false otherwise
     */
    @Transient
    public boolean hasPayments() {
        return !payments.isEmpty();
    }
}