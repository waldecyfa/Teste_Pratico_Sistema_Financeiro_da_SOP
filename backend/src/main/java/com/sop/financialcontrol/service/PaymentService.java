package com.sop.financialcontrol.service;

import com.sop.financialcontrol.dto.PaymentDTO;
import com.sop.financialcontrol.exception.BusinessException;
import com.sop.financialcontrol.exception.ResourceNotFoundException;
import com.sop.financialcontrol.mapper.PaymentMapper;
import com.sop.financialcontrol.model.Commitment;
import com.sop.financialcontrol.model.Expense;
import com.sop.financialcontrol.model.Payment;
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
 * Service for handling Payment-related business logic.
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CommitmentRepository commitmentRepository;
    private final ExpenseRepository expenseRepository;
    private final PaymentMapper paymentMapper;

    // Regular expression for payment number validation
    private static final Pattern PAYMENT_NUMBER_PATTERN = 
            Pattern.compile("^\\d{4}NP\\d{4}$");

    /**
     * Get all payments.
     *
     * @return A list of all payments as DTOs
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return paymentMapper.toDtoList(payments);
    }

    /**
     * Get a payment by its ID.
     *
     * @param id The ID of the payment to retrieve
     * @return The payment as a DTO
     * @throws ResourceNotFoundException if the payment is not found
     */
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(Long id) {
        Payment payment = findPaymentById(id);
        return paymentMapper.toDto(payment);
    }

    /**
     * Get a payment by its payment number.
     *
     * @param paymentNumber The payment number of the payment to retrieve
     * @return The payment as a DTO
     * @throws ResourceNotFoundException if the payment is not found
     */
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentByPaymentNumber(String paymentNumber) {
        Payment payment = paymentRepository.findByPaymentNumber(paymentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with payment number: " + paymentNumber));
        return paymentMapper.toDto(payment);
    }

    /**
     * Get all payments for a commitment.
     *
     * @param commitmentId The ID of the commitment
     * @return A list of payments for the commitment
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByCommitmentId(Long commitmentId) {
        // Verify that the commitment exists
        if (!commitmentRepository.existsById(commitmentId)) {
            throw new ResourceNotFoundException("Commitment not found with id: " + commitmentId);
        }

        List<Payment> payments = paymentRepository.findByCommitmentId(commitmentId);
        return paymentMapper.toDtoList(payments);
    }

    /**
     * Create a new payment.
     *
     * @param paymentDTO The payment data to create
     * @return The created payment as a DTO
     * @throws ResourceNotFoundException if the commitment is not found
     * @throws BusinessException if the payment number is invalid or already exists,
     *                          or if the payment amount exceeds the remaining commitment amount
     */
    @Transactional
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        // Validate payment number format
        validatePaymentNumber(paymentDTO.getPaymentNumber());

        // Check if payment number already exists
        if (paymentRepository.existsByPaymentNumber(paymentDTO.getPaymentNumber())) {
            throw new BusinessException("A payment with payment number " + paymentDTO.getPaymentNumber() + " already exists");
        }

        // Find the commitment
        Commitment commitment = commitmentRepository.findById(paymentDTO.getCommitmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Commitment not found with id: " + paymentDTO.getCommitmentId()));

        // Calculate the total paid amount for the commitment
        BigDecimal totalPaid = paymentRepository.calculateTotalPaidAmountForCommitment(commitment.getId());
        BigDecimal remainingAmount = commitment.getAmount().subtract(totalPaid);

        // Check if the payment amount exceeds the remaining commitment amount
        if (paymentDTO.getAmount().compareTo(remainingAmount) > 0) {
            throw new BusinessException("Payment amount exceeds the remaining commitment amount. Remaining: " + remainingAmount);
        }

        // Convert DTO to entity and save
        Payment payment = paymentMapper.toEntity(paymentDTO, commitment);
        Payment savedPayment = paymentRepository.save(payment);

        // Update expense status
        Expense expense = commitment.getExpense();
        expense.updateStatus();
        expenseRepository.save(expense);

        return paymentMapper.toDto(savedPayment);
    }

    /**
     * Update an existing payment.
     *
     * @param id The ID of the payment to update
     * @param paymentDTO The new payment data
     * @return The updated payment as a DTO
     * @throws ResourceNotFoundException if the payment is not found
     * @throws BusinessException if the payment number is invalid or already exists,
     *                          or if the payment amount exceeds the remaining commitment amount
     */
    @Transactional
    public PaymentDTO updatePayment(Long id, PaymentDTO paymentDTO) {
        Payment existingPayment = findPaymentById(id);

        // Validate payment number format
        validatePaymentNumber(paymentDTO.getPaymentNumber());

        // Check if payment number already exists (for a different payment)
        if (!existingPayment.getPaymentNumber().equals(paymentDTO.getPaymentNumber()) &&
                paymentRepository.existsByPaymentNumber(paymentDTO.getPaymentNumber())) {
            throw new BusinessException("A payment with payment number " + paymentDTO.getPaymentNumber() + " already exists");
        }

        // Check if the commitment ID is being changed
        if (!existingPayment.getCommitment().getId().equals(paymentDTO.getCommitmentId())) {
            throw new BusinessException("Cannot change the commitment associated with a payment");
        }

        // Calculate the total paid amount for the commitment (excluding this payment)
        BigDecimal totalPaid = paymentRepository.calculateTotalPaidAmountForCommitment(existingPayment.getCommitment().getId())
                .subtract(existingPayment.getAmount());
        BigDecimal remainingAmount = existingPayment.getCommitment().getAmount().subtract(totalPaid);

        // Check if the new payment amount exceeds the remaining commitment amount
        if (paymentDTO.getAmount().compareTo(remainingAmount) > 0) {
            throw new BusinessException("Payment amount exceeds the remaining commitment amount. Remaining: " + remainingAmount);
        }

        // Update the entity
        Payment updatedPayment = paymentMapper.updateEntityFromDto(paymentDTO, existingPayment);
        Payment savedPayment = paymentRepository.save(updatedPayment);

        // Update expense status
        Expense expense = existingPayment.getCommitment().getExpense();
        expense.updateStatus();
        expenseRepository.save(expense);

        return paymentMapper.toDto(savedPayment);
    }

    /**
     * Delete a payment by its ID.
     *
     * @param id The ID of the payment to delete
     * @throws ResourceNotFoundException if the payment is not found
     */
    @Transactional
    public void deletePayment(Long id) {
        Payment payment = findPaymentById(id);

        // Get the expense for status update after deletion
        Expense expense = payment.getCommitment().getExpense();

        // Delete the payment
        paymentRepository.delete(payment);

        // Update expense status
        expense.updateStatus();
        expenseRepository.save(expense);
    }

    /**
     * Find a payment by its ID.
     *
     * @param id The ID of the payment to find
     * @return The payment entity
     * @throws ResourceNotFoundException if the payment is not found
     */
    private Payment findPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    /**
     * Validate the format of a payment number.
     *
     * @param paymentNumber The payment number to validate
     * @throws BusinessException if the payment number is invalid
     */
    private void validatePaymentNumber(String paymentNumber) {
        if (!PAYMENT_NUMBER_PATTERN.matcher(paymentNumber).matches()) {
            throw new BusinessException("Invalid payment number format. Expected format: ####NP####");
        }

        // Check if the year part matches the current year
        int currentYear = LocalDate.now().getYear();
        int paymentYear = Integer.parseInt(paymentNumber.substring(0, 4));

        if (paymentYear != currentYear) {
            throw new BusinessException("Payment number must start with the current year: " + currentYear);
        }
    }
}