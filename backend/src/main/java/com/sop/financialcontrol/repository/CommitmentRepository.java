package com.sop.financialcontrol.repository;

import com.sop.financialcontrol.model.Commitment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Commitment entity operations.
 */
@Repository
public interface CommitmentRepository extends JpaRepository<Commitment, Long> {

    /**
     * Find a commitment by its commitment number.
     *
     * @param commitmentNumber The commitment number to search for
     * @return An Optional containing the commitment if found
     */
    Optional<Commitment> findByCommitmentNumber(String commitmentNumber);

    /**
     * Check if a commitment with the given commitment number exists.
     *
     * @param commitmentNumber The commitment number to check
     * @return true if a commitment with the commitment number exists, false otherwise
     */
    boolean existsByCommitmentNumber(String commitmentNumber);

    /**
     * Find commitments by expense ID.
     *
     * @param expenseId The expense ID to search for
     * @return A list of commitments associated with the given expense
     */
    List<Commitment> findByExpenseId(Long expenseId);

    /**
     * Find commitments with commitment dates between the given dates.
     *
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return A list of commitments with commitment dates in the given range
     */
    List<Commitment> findByCommitmentDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Find commitments that have no associated payments.
     *
     * @return A list of commitments with no payments
     */
    @Query("SELECT c FROM Commitment c WHERE c.payments IS EMPTY")
    List<Commitment> findCommitmentsWithNoPayments();

    /**
     * Find commitments that have at least one payment but are not fully paid.
     *
     * @return A list of partially paid commitments
     */
    @Query("SELECT c FROM Commitment c JOIN c.payments p GROUP BY c.id HAVING SUM(p.amount) < c.amount")
    List<Commitment> findPartiallyPaidCommitments();

    /**
     * Calculate the total committed amount for an expense.
     *
     * @param expenseId The expense ID
     * @return The total committed amount
     */
    @Query("SELECT COALESCE(SUM(c.amount), 0) FROM Commitment c WHERE c.expense.id = :expenseId")
    java.math.BigDecimal calculateTotalCommittedAmountForExpense(@Param("expenseId") Long expenseId);

    /**
     * Check if a commitment has any associated payments.
     *
     * @param commitmentId The commitment ID
     * @return true if the commitment has payments, false otherwise
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Payment p WHERE p.commitment.id = :commitmentId")
    boolean hasPayments(@Param("commitmentId") Long commitmentId);
}