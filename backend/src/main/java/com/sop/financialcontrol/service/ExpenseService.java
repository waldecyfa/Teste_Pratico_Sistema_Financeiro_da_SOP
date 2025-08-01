package com.sop.financialcontrol.service;

import com.sop.financialcontrol.dto.ExpenseDTO;
import com.sop.financialcontrol.exception.BusinessException;
import com.sop.financialcontrol.exception.ResourceNotFoundException;    
import com.sop.financialcontrol.mapper.ExpenseMapper;
import com.sop.financialcontrol.model.Expense;
import com.sop.financialcontrol.model.ExpenseStatus;
import com.sop.financialcontrol.repository.CommitmentRepository;
import com.sop.financialcontrol.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Service for handling Expense-related business logic.
 */
@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CommitmentRepository commitmentRepository;
    private final ExpenseMapper expenseMapper;

    // Regular expression for protocol number validation
    private static final Pattern PROTOCOL_NUMBER_PATTERN = 
            Pattern.compile("^\\d{5}\\.\\d{6}/\\d{4}-\\d{2}$");

    /**
     * Get all expenses.
     *
     * @return A list of all expenses as DTOs
     */
    @Transactional(readOnly = true)
    public List<ExpenseDTO> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenseMapper.toDtoList(expenses);
    }

    /**
     * Get an expense by its ID.
     *
     * @param id The ID of the expense to retrieve
     * @return The expense as a DTO
     * @throws ResourceNotFoundException if the expense is not found
     */
    @Transactional(readOnly = true)
    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = findExpenseById(id);
        return expenseMapper.toDto(expense);
    }

    /**
     * Get an expense by its protocol number.
     *
     * @param protocolNumber The protocol number of the expense to retrieve
     * @return The expense as a DTO
     * @throws ResourceNotFoundException if the expense is not found
     */
    @Transactional(readOnly = true)
    public ExpenseDTO getExpenseByProtocolNumber(String protocolNumber) {
        Expense expense = expenseRepository.findByProtocolNumber(protocolNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with protocol number: " + protocolNumber));
        return expenseMapper.toDto(expense);
    }

    /**
     * Create a new expense.
     *
     * @param expenseDTO The expense data to create
     * @return The created expense as a DTO
     * @throws BusinessException if the protocol number is invalid or already exists
     */
    @Transactional
    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        // Validate protocol number format
        validateProtocolNumber(expenseDTO.getProtocolNumber());

        // Check if protocol number already exists
        if (expenseRepository.existsByProtocolNumber(expenseDTO.getProtocolNumber())) {
            throw new BusinessException("An expense with protocol number " + expenseDTO.getProtocolNumber() + " already exists");
        }

        // Set initial status
        expenseDTO.setStatus(ExpenseStatus.AWAITING_COMMITMENT);

        // Convert DTO to entity and save
        Expense expense = expenseMapper.toEntity(expenseDTO);
        Expense savedExpense = expenseRepository.save(expense);

        return expenseMapper.toDto(savedExpense);
    }

    /**
     * Update an existing expense.
     *
     * @param id The ID of the expense to update
     * @param expenseDTO The new expense data
     * @return The updated expense as a DTO
     * @throws ResourceNotFoundException if the expense is not found
     * @throws BusinessException if the protocol number is invalid or already exists
     */
    @Transactional
    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Expense existingExpense = findExpenseById(id);

        // Validate protocol number format
        validateProtocolNumber(expenseDTO.getProtocolNumber());

        // Check if protocol number already exists (for a different expense)
        if (!existingExpense.getProtocolNumber().equals(expenseDTO.getProtocolNumber()) &&
                expenseRepository.existsByProtocolNumber(expenseDTO.getProtocolNumber())) {
            throw new BusinessException("An expense with protocol number " + expenseDTO.getProtocolNumber() + " already exists");
        }

        // Check if the amount is being reduced below the committed amount
        BigDecimal totalCommitted = commitmentRepository.calculateTotalCommittedAmountForExpense(id);
        if (expenseDTO.getAmount().compareTo(totalCommitted) < 0) {
            throw new BusinessException("Cannot reduce expense amount below the total committed amount: " + totalCommitted);
        }

        // Update the entity
        Expense updatedExpense = expenseMapper.updateEntityFromDto(expenseDTO, existingExpense);
        
        // Update status based on commitments and payments
        updatedExpense.updateStatus();
        
        Expense savedExpense = expenseRepository.save(updatedExpense);

        return expenseMapper.toDto(savedExpense);
    }

    /**
     * Delete an expense by its ID.
     *
     * @param id The ID of the expense to delete
     * @throws ResourceNotFoundException if the expense is not found
     * @throws BusinessException if the expense has associated commitments
     */
    @Transactional
    public void deleteExpense(Long id) {
        Expense expense = findExpenseById(id);

        // Check if the expense has any commitments
        if (!expense.getCommitments().isEmpty()) {
            throw new BusinessException("Cannot delete expense with associated commitments");
        }

        expenseRepository.delete(expense);
    }

    /**
     * Get expenses by their status.
     *
     * @param status The status to filter by
     * @return A list of expenses with the given status
     */
    @Transactional(readOnly = true)
    public List<ExpenseDTO> getExpensesByStatus(ExpenseStatus status) {
        List<Expense> expenses = expenseRepository.findByStatus(status);
        return expenseMapper.toDtoList(expenses);
    }

    /**
     * Find an expense by its ID.
     *
     * @param id The ID of the expense to find
     * @return The expense entity
     * @throws ResourceNotFoundException if the expense is not found
     */
    private Expense findExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }

    /**
     * Validate the format of a protocol number.
     *
     * @param protocolNumber The protocol number to validate
     * @throws BusinessException if the protocol number is invalid
     */
    private void validateProtocolNumber(String protocolNumber) {
        if (!PROTOCOL_NUMBER_PATTERN.matcher(protocolNumber).matches()) {
            throw new BusinessException("Invalid protocol number format. Expected format: #####.######/####-##");
        }
    }
}