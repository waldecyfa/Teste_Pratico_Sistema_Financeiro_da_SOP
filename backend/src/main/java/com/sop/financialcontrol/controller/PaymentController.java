package com.sop.financialcontrol.controller;

import com.sop.financialcontrol.dto.PaymentDTO;
import com.sop.financialcontrol.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing payments.
 */
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment management APIs")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Get all payments.
     *
     * @return A list of all payments
     */
    @GetMapping
    @Operation(summary = "Get all payments", description = "Retrieve a list of all payments")
    @ApiResponse(responseCode = "200", description = "Payments retrieved successfully")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    /**
     * Get a payment by its ID.
     *
     * @param id The ID of the payment to retrieve
     * @return The payment with the given ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID", description = "Retrieve a payment by its ID")
    @ApiResponse(responseCode = "200", description = "Payment retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Payment not found", content = @Content)
    public ResponseEntity<PaymentDTO> getPaymentById(
            @Parameter(description = "Payment ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    /**
     * Get a payment by its payment number.
     *
     * @param paymentNumber The payment number of the payment to retrieve
     * @return The payment with the given payment number
     */
    @GetMapping("/number/{paymentNumber}")
    @Operation(summary = "Get payment by payment number", description = "Retrieve a payment by its payment number")
    @ApiResponse(responseCode = "200", description = "Payment retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Payment not found", content = @Content)
    public ResponseEntity<PaymentDTO> getPaymentByPaymentNumber(
            @Parameter(description = "Payment number", required = true)
            @PathVariable String paymentNumber) {
        return ResponseEntity.ok(paymentService.getPaymentByPaymentNumber(paymentNumber));
    }

    /**
     * Get all payments for a commitment.
     *
     * @param commitmentId The ID of the commitment
     * @return A list of payments for the commitment
     */
    @GetMapping("/commitment/{commitmentId}")
    @Operation(summary = "Get payments by commitment ID", description = "Retrieve a list of payments for the given commitment")
    @ApiResponse(responseCode = "200", description = "Payments retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Commitment not found", content = @Content)
    public ResponseEntity<List<PaymentDTO>> getPaymentsByCommitmentId(
            @Parameter(description = "Commitment ID", required = true)
            @PathVariable Long commitmentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByCommitmentId(commitmentId));
    }

    /**
     * Create a new payment.
     *
     * @param paymentDTO The payment data to create
     * @return The created payment
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new payment", description = "Create a new payment with the provided data")
    @ApiResponse(responseCode = "201", description = "Payment created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    @ApiResponse(responseCode = "404", description = "Commitment not found", content = @Content)
    public ResponseEntity<PaymentDTO> createPayment(
            @Parameter(description = "Payment data", required = true, schema = @Schema(implementation = PaymentDTO.class))
            @Valid @RequestBody PaymentDTO paymentDTO) {
        return new ResponseEntity<>(paymentService.createPayment(paymentDTO), HttpStatus.CREATED);
    }

    /**
     * Update an existing payment.
     *
     * @param id The ID of the payment to update
     * @param paymentDTO The new payment data
     * @return The updated payment
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update a payment", description = "Update an existing payment with the provided data")
    @ApiResponse(responseCode = "200", description = "Payment updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    @ApiResponse(responseCode = "404", description = "Payment not found", content = @Content)
    public ResponseEntity<PaymentDTO> updatePayment(
            @Parameter(description = "Payment ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated payment data", required = true, schema = @Schema(implementation = PaymentDTO.class))
            @Valid @RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.ok(paymentService.updatePayment(id, paymentDTO));
    }

    /**
     * Delete a payment by its ID.
     *
     * @param id The ID of the payment to delete
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a payment", description = "Delete a payment by its ID")
    @ApiResponse(responseCode = "204", description = "Payment deleted successfully")
    @ApiResponse(responseCode = "404", description = "Payment not found", content = @Content)
    public ResponseEntity<Void> deletePayment(
            @Parameter(description = "Payment ID", required = true)
            @PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}