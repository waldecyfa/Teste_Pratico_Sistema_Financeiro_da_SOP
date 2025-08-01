package com.sop.financialcontrol.service;

import com.sop.financialcontrol.dto.CommitmentDTO;
import com.sop.financialcontrol.exception.BusinessException;
import com.sop.financialcontrol.exception.ResourceNotFoundException;
import com.sop.financialcontrol.mapper.CommitmentMapper;
import com.sop.financialcontrol.model.Commitment;
import com.sop.financialcontrol.model.Expense;
import com.sop.financialcontrol.repository.CommitmentRepository;
import com.sop.financialcontrol.repository.ExpenseRepository;
import com.sop.financialcontrol.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Service for handling Commitment-related business logic.
 */
@Service
@RequiredArgsConstructor
public class CommitmentService {

    private final CommitmentRepository commitmentRepository;
    private final ExpenseRepository expenseRepository;
    private final PaymentRepository paymentRepository;
    private final CommitmentMapper commitmentMapper;

    // Regular expression for commitment number validation
    private static final Pattern COMMITMENT_NUMBER_PATTERN = 
            Pattern.compile("^\\d{4}NE\\d{4}$");

    /**
     * Get all commitments.
     *
     * @return A list of all commitments as DTOs
     */
    @Transactional(readOnly = true)
    public List<CommitmentDTO> getAllCommitments() {
        List<Commitment> commitments = commitmentRepository.findAll();
        return commitmentMapper.toDtoList(commitments);
    }

    /**
     * Get a commitment by its ID.
     *
     * @param id The ID of the commitment to retrieve
     * @return The commitment as a DTO
     * @throws ResourceNotFoundException if the commitment is not found
     */
    @Transactional(readOnly = true)
    public CommitmentDTO getCommitmentById(Long id) {
        Commitment commitment = findCommitmentById(id);
        return commitmentMapper.toDto(commitment);
    }

    /**
     * Get a commitment by its commitment number.
     *
     * @param commitmentNumber The commitment number of the commitment to retrieve
     * @return The commitment as a DTO
     * @throws ResourceNotFoundException if the commitment is not found
     */
    @Transactional(readOnly = true)
    public CommitmentDTO getCommitmentByCommitmentNumber(String commitmentNumber) {
        Commitment commitment = commitmentRepository.findByCommitmentNumber(commitmentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Commitment not found with commitment number: " + commitmentNumber));
        return commitmentMapper.toDto(commitment);
    }

    /**
     * Get all commitments for an expense.
     *
     * @param expenseId The ID of the expense
     * @return A list of commitments for the expense
     */
    @Transactional(readOnly = true)
    public List<CommitmentDTO> getCommitmentsByExpenseId(Long expenseId) {
        // Verify that the expense exists
        if (!expenseRepository.existsById(expenseId)) {
            throw new ResourceNotFoundException("Expense not found with id: " + expenseId);
        }

        List<Commitment> commitments = commitmentRepository.findByExpenseId(expenseId);
        return commitmentMapper.toDtoList(commitments);
    }

    /**
     * Create a new commitment.
     *
     * @param commitmentDTO The commitment data to create
     * @return The created commitment as a DTO
     * @throws ResourceNotFoundException if the expense is not found
     * @throws BusinessException if the commitment number is invalid or already exists,
     *                          or if the commitment amount exceeds the remaining expense amount
     */
    @Transactional
    public CommitmentDTO createCommitment(CommitmentDTO commitmentDTO) {
        // Validate commitment number format
        validateCommitmentNumber(commitmentDTO.getCommitmentNumber());

        // Check if commitment number already exists
        if (commitmentRepository.existsByCommitmentNumber(commitmentDTO.getCommitmentNumber())) {
            throw new BusinessException("A commitment with commitment number " + commitmentDTO.getCommitmentNumber() + " already exists");
        }

        // Find the expense
        Expense expense = expenseRepository.findById(commitmentDTO.getExpenseId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + commitmentDTO.getExpenseId()));

        // Calculate the total committed amount for the expense
        BigDecimal totalCommitted = commitmentRepository.calculateTotalCommittedAmountForExpense(expense.getId());
        BigDecimal remainingAmount = expense.getAmount().subtract(totalCommitted);

        // Check if the commitment amount exceeds the remaining expense amount
        if (commitmentDTO.getAmount().compareTo(remainingAmount) > 0) {
            throw new BusinessException("Commitment amount exceeds the remaining expense amount. Remaining: " + remainingAmount);
        }

        // Convert DTO to entity and save
        Commitment commitment = commitmentMapper.toEntity(commitmentDTO, expense);
        Commitment savedCommitment = commitmentRepository.save(commitment);

        // Update expense status
        expense.updateStatus();
        expenseRepository.save(expense);

        return commitmentMapper.toDto(savedCommitment);
    }

    /**
     * Update an existing commitment.
     *
     * @param id The ID of the commitment to update
     * @param commitmentDTO The new commitment data
     * @return The updated commitment as a DTO
     * @throws ResourceNotFoundException if the commitment is not found
     * @throws BusinessException if the commitment number is invalid or already exists,
     *                          or if the commitment amount exceeds the remaining expense amount
     */
    @Transactional
    public CommitmentDTO updateCommitment(Long id, CommitmentDTO commitmentDTO) {
        Commitment existingCommitment = findCommitmentById(id);

        // Validate commitment number format
        validateCommitmentNumber(commitmentDTO.getCommitmentNumber());

        // Check if commitment number already exists (for a different commitment)
        if (!existingCommitment.getCommitmentNumber().equals(commitmentDTO.getCommitmentNumber()) &&
                commitmentRepository.existsByCommitmentNumber(commitmentDTO.getCommitmentNumber())) {
            throw new BusinessException("A commitment with commitment number " + commitmentDTO.getCommitmentNumber() + " already exists");
        }

        // Check if the expense ID is being changed
        if (!existingCommitment.getExpense().getId().equals(commitmentDTO.getExpenseId())) {
            throw new BusinessException("Cannot change the expense associated with a commitment");
        }

        // Calculate the total paid amount for this commitment
        BigDecimal totalPaid = paymentRepository.calculateTotalPaidAmountForCommitment(id);

        // Check if the amount is being reduced below the paid amount
        if (commitmentDTO.getAmount().compareTo(totalPaid) < 0) {
            throw new BusinessException("Cannot reduce commitment amount below the total paid amount: " + totalPaid);
        }

        // Calculate the total committed amount for the expense (excluding this commitment)
        BigDecimal totalCommitted = commitmentRepository.calculateTotalCommittedAmountForExpense(existingCommitment.getExpense().getId())
                .subtract(existingCommitment.getAmount());
        BigDecimal remainingAmount = existingCommitment.getExpense().getAmount().subtract(totalCommitted);

        // Check if the new commitment amount exceeds the remaining expense amount
        if (commitmentDTO.getAmount().compareTo(remainingAmount) > 0) {
            throw new BusinessException("Commitment amount exceeds the remaining expense amount. Remaining: " + remainingAmount);
        }

        // Update the entity
        Commitment updatedCommitment = commitmentMapper.updateEntityFromDto(commitmentDTO, existingCommitment);
        Commitment savedCommitment = commitmentRepository.save(updatedCommitment);

        // Update expense status
        Expense expense = existingCommitment.getExpense();
        expense.updateStatus();
        expenseRepository.save(expense);

        return commitmentMapper.toDto(savedCommitment);
    }

    /**
     * Delete a commitment by its ID.
     *
     * @param id The ID of the commitment to delete
     * @throws ResourceNotFoundException if the commitment is not found
     * @throws BusinessException if the commitment has associated payments
     */
    @Transactional
    public void deleteCommitment(Long id) {
        Commitment commitment = findCommitmentById(id);

        // Check if the commitment has any payments
        if (commitmentRepository.hasPayments(id)) {
            throw new BusinessException("Cannot delete commitment with associated payments");
        }

        // Get the expense for status update after deletion
        Expense expense = commitment.getExpense();

        // Delete the commitment
        commitmentRepository.delete(commitment);

        // Update expense status
        expense.updateStatus();
        expenseRepository.save(expense);
    }

    /**
     * Find a commitment by its ID.
     *
     * @param id The ID of the commitment to find
     * @return The commitment entity
     * @throws ResourceNotFoundException if the commitment is not found
     */
    private Commitment findCommitmentById(Long id) {
        return commitmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commitment not found with id: " + id));
    }

    /**
     * Validate the format of a commitment number.
     *
     * @param commitmentNumber The commitment number to validate
     * @throws BusinessException if the commitment number is invalid
     */
    private void validateCommitmentNumber(String commitmentNumber) {
        if (!COMMITMENT_NUMBER_PATTERN.matcher(commitmentNumber).matches()) {
            throw new BusinessException("Invalid commitment number format. Expected format: ####NE####");
        }

        // Check if the year part matches the current year
        int currentYear = LocalDate.now().getYear();
        int commitmentYear = Integer.parseInt(commitmentNumber.substring(0, 4));

        if (commitmentYear != currentYear) {
            throw new BusinessException("Commitment number must start with the current year: " + currentYear);
        }
    }
}