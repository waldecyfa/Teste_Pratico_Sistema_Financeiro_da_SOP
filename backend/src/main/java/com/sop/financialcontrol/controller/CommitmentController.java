package com.sop.financialcontrol.controller;

import com.sop.financialcontrol.dto.CommitmentDTO;
import com.sop.financialcontrol.service.CommitmentService;
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
 * REST controller for managing commitments.
 */
@RestController
@RequestMapping("/commitments")
@RequiredArgsConstructor
@Tag(name = "Commitment", description = "Commitment management APIs")
public class CommitmentController {

    private final CommitmentService commitmentService;

    /**
     * Get all commitments.
     *
     * @return A list of all commitments
     */
    @GetMapping
    @Operation(summary = "Get all commitments", description = "Retrieve a list of all commitments")
    @ApiResponse(responseCode = "200", description = "Commitments retrieved successfully")
    public ResponseEntity<List<CommitmentDTO>> getAllCommitments() {
        return ResponseEntity.ok(commitmentService.getAllCommitments());
    }

    /**
     * Get a commitment by its ID.
     *
     * @param id The ID of the commitment to retrieve
     * @return The commitment with the given ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get commitment by ID", description = "Retrieve a commitment by its ID")
    @ApiResponse(responseCode = "200", description = "Commitment retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Commitment not found", content = @Content)
    public ResponseEntity<CommitmentDTO> getCommitmentById(
            @Parameter(description = "Commitment ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(commitmentService.getCommitmentById(id));
    }

    /**
     * Get a commitment by its commitment number.
     *
     * @param commitmentNumber The commitment number of the commitment to retrieve
     * @return The commitment with the given commitment number
     */
    @GetMapping("/number/{commitmentNumber}")
    @Operation(summary = "Get commitment by commitment number", description = "Retrieve a commitment by its commitment number")
    @ApiResponse(responseCode = "200", description = "Commitment retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Commitment not found", content = @Content)
    public ResponseEntity<CommitmentDTO> getCommitmentByCommitmentNumber(
            @Parameter(description = "Commitment number", required = true)
            @PathVariable String commitmentNumber) {
        return ResponseEntity.ok(commitmentService.getCommitmentByCommitmentNumber(commitmentNumber));
    }

    /**
     * Get all commitments for an expense.
     *
     * @param expenseId The ID of the expense
     * @return A list of commitments for the expense
     */
    @GetMapping("/expense/{expenseId}")
    @Operation(summary = "Get commitments by expense ID", description = "Retrieve a list of commitments for the given expense")
    @ApiResponse(responseCode = "200", description = "Commitments retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Expense not found", content = @Content)
    public ResponseEntity<List<CommitmentDTO>> getCommitmentsByExpenseId(
            @Parameter(description = "Expense ID", required = true)
            @PathVariable Long expenseId) {
        return ResponseEntity.ok(commitmentService.getCommitmentsByExpenseId(expenseId));
    }

    /**
     * Create a new commitment.
     *
     * @param commitmentDTO The commitment data to create
     * @return The created commitment
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new commitment", description = "Create a new commitment with the provided data")
    @ApiResponse(responseCode = "201", description = "Commitment created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    @ApiResponse(responseCode = "404", description = "Expense not found", content = @Content)
    public ResponseEntity<CommitmentDTO> createCommitment(
            @Parameter(description = "Commitment data", required = true, schema = @Schema(implementation = CommitmentDTO.class))
            @Valid @RequestBody CommitmentDTO commitmentDTO) {
        return new ResponseEntity<>(commitmentService.createCommitment(commitmentDTO), HttpStatus.CREATED);
    }

    /**
     * Update an existing commitment.
     *
     * @param id The ID of the commitment to update
     * @param commitmentDTO The new commitment data
     * @return The updated commitment
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update a commitment", description = "Update an existing commitment with the provided data")
    @ApiResponse(responseCode = "200", description = "Commitment updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    @ApiResponse(responseCode = "404", description = "Commitment not found", content = @Content)
    public ResponseEntity<CommitmentDTO> updateCommitment(
            @Parameter(description = "Commitment ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated commitment data", required = true, schema = @Schema(implementation = CommitmentDTO.class))
            @Valid @RequestBody CommitmentDTO commitmentDTO) {
        return ResponseEntity.ok(commitmentService.updateCommitment(id, commitmentDTO));
    }

    /**
     * Delete a commitment by its ID.
     *
     * @param id The ID of the commitment to delete
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a commitment", description = "Delete a commitment by its ID")
    @ApiResponse(responseCode = "204", description = "Commitment deleted successfully")
    @ApiResponse(responseCode = "400", description = "Commitment has associated payments", content = @Content)
    @ApiResponse(responseCode = "404", description = "Commitment not found", content = @Content)
    public ResponseEntity<Void> deleteCommitment(
            @Parameter(description = "Commitment ID", required = true)
            @PathVariable Long id) {
        commitmentService.deleteCommitment(id);
        return ResponseEntity.noContent().build();
    }
}