package com.sop.financialcontrol.repository;

import com.sop.financialcontrol.model.Expense;
import com.sop.financialcontrol.model.ExpenseStatus;
import com.sop.financialcontrol.model.ExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Expense entity operations.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Find an expense by its protocol number.
     *
     * @param protocolNumber The protocol number to search for
     * @return An Optional containing the expense if found
     */
    Optional<Expense> findByProtocolNumber(String protocolNumber);

    /**
     * Check if an expense with the given protocol number exists.
     *
     * @param protocolNumber The protocol number to check
     * @return true if an expense with the protocol number exists, false otherwise
     */
    boolean existsByProtocolNumber(String protocolNumber);

    /**
     * Find expenses by their status.
     *
     * @param status The status to search for
     * @return A list of expenses with the given status
     */
    List<Expense> findByStatus(ExpenseStatus status);

    /**
     * Find expenses by their type.
     *
     * @param expenseType The type to search for
     * @return A list of expenses with the given type
     */
    List<Expense> findByExpenseType(ExpenseType expenseType);

    /**
     * Find expenses with due dates before the given date.
     *
     * @param date The date to compare against
     * @return A list of expenses with due dates before the given date
     */
    List<Expense> findByDueDateBefore(LocalDate date);

    /**
     * Find expenses by creditor name (case-insensitive, partial match).
     *
     * @param creditor The creditor name to search for
     * @return A list of expenses with matching creditor names
     */
    List<Expense> findByCreditorContainingIgnoreCase(String creditor);

    /**
     * Find expenses that have no associated commitments.
     *
     * @return A list of expenses with no commitments
     */
    @Query("SELECT e FROM Expense e WHERE e.commitments IS EMPTY")
    List<Expense> findExpensesWithNoCommitments();

    /**
     * Find expenses that have at least one commitment but are not fully committed.
     *
     * @return A list of partially committed expenses
     */
    @Query("SELECT e FROM Expense e JOIN e.commitments c GROUP BY e.id HAVING SUM(c.amount) < e.amount")
    List<Expense> findPartiallyCommittedExpenses();

    /**
     * Find expenses that are fully committed but have no payments.
     *
     * @return A list of expenses awaiting payment
     */
    @Query("SELECT e FROM Expense e WHERE e.id IN " +
           "(SELECT c.expense.id FROM Commitment c GROUP BY c.expense.id HAVING SUM(c.amount) = " +
           "(SELECT e2.amount FROM Expense e2 WHERE e2.id = c.expense.id)) " +
           "AND e.id NOT IN (SELECT DISTINCT c.expense.id FROM Commitment c JOIN c.payments p)")
    List<Expense> findExpensesAwaitingPayment();
}