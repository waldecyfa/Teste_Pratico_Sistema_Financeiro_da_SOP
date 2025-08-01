package com.sop.financialcontrol.repository;

import com.sop.financialcontrol.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Payment entity operations.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find a payment by its payment number.
     *
     * @param paymentNumber The payment number to search for
     * @return An Optional containing the payment if found
     */
    Optional<Payment> findByPaymentNumber(String paymentNumber);

    /**
     * Check if a payment with the given payment number exists.
     *
     * @param paymentNumber The payment number to check
     * @return true if a payment with the payment number exists, false otherwise
     */
    boolean existsByPaymentNumber(String paymentNumber);

    /**
     * Find payments by commitment ID.
     *
     * @param commitmentId The commitment ID to search for
     * @return A list of payments associated with the given commitment
     */
    List<Payment> findByCommitmentId(Long commitmentId);

    /**
     * Find payments with payment dates between the given dates.
     *
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return A list of payments with payment dates in the given range
     */
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Calculate the total paid amount for a commitment.
     *
     * @param commitmentId The commitment ID
     * @return The total paid amount
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.commitment.id = :commitmentId")
    java.math.BigDecimal calculateTotalPaidAmountForCommitment(@Param("commitmentId") Long commitmentId);

    /**
     * Calculate the total paid amount for an expense (across all commitments).
     *
     * @param expenseId The expense ID
     * @return The total paid amount
     */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p JOIN p.commitment c WHERE c.expense.id = :expenseId")
    java.math.BigDecimal calculateTotalPaidAmountForExpense(@Param("expenseId") Long expenseId);
}