package com.sop.financialcontrol.controller;

import com.sop.financialcontrol.dto.ExpenseDTO;
import com.sop.financialcontrol.model.ExpenseStatus;
import com.sop.financialcontrol.service.ExpenseService;
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
 * REST controller for managing expenses.
 */
@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense", description = "Expense management APIs")
public class ExpenseController {

    private final ExpenseService expenseService;

    /**
     * Get all expenses.
     *
     * @return A list of all expenses
     */
    @GetMapping
    @Operation(summary = "Get all expenses", description = "Retrieve a list of all expenses")
    @ApiResponse(responseCode = "200", description = "Expenses retrieved successfully")
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    /**
     * Get an expense by its ID.
     *
     * @param id The ID of the expense to retrieve
     * @return The expense with the given ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID", description = "Retrieve an expense by its ID")
    @ApiResponse(responseCode = "200", description = "Expense retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Expense not found", content = @Content)
    public ResponseEntity<ExpenseDTO> getExpenseById(
            @Parameter(description = "Expense ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    /**
     * Get an expense by its protocol number.
     *
     * @param protocolNumber The protocol number of the expense to retrieve
     * @return The expense with the given protocol number
     */
    @GetMapping("/protocol/{protocolNumber}")
    @Operation(summary = "Get expense by protocol number", description = "Retrieve an expense by its protocol number")
    @ApiResponse(responseCode = "200", description = "Expense retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Expense not found", content = @Content)
    public ResponseEntity<ExpenseDTO> getExpenseByProtocolNumber(
            @Parameter(description = "Protocol number", required = true)
            @PathVariable String protocolNumber) {
        return ResponseEntity.ok(expenseService.getExpenseByProtocolNumber(protocolNumber));
    }

    /**
     * Get expenses by their status.
     *
     * @param status The status to filter by
     * @return A list of expenses with the given status
     */
    @GetMapping("/status/{status}")
    @Operation(summary = "Get expenses by status", description = "Retrieve a list of expenses with the given status")
    @ApiResponse(responseCode = "200", description = "Expenses retrieved successfully")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByStatus(
            @Parameter(description = "Expense status", required = true)
            @PathVariable ExpenseStatus status) {
        return ResponseEntity.ok(expenseService.getExpensesByStatus(status));
    }

    /**
     * Create a new expense.
     *
     * @param expenseDTO The expense data to create
     * @return The created expense
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new expense", description = "Create a new expense with the provided data")
    @ApiResponse(responseCode = "201", description = "Expense created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    public ResponseEntity<ExpenseDTO> createExpense(
            @Parameter(description = "Expense data", required = true, schema = @Schema(implementation = ExpenseDTO.class))
            @Valid @RequestBody ExpenseDTO expenseDTO) {
        return new ResponseEntity<>(expenseService.createExpense(expenseDTO), HttpStatus.CREATED);
    }

    /**
     * Update an existing expense.
     *
     * @param id The ID of the expense to update
     * @param expenseDTO The new expense data
     * @return The updated expense
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an expense", description = "Update an existing expense with the provided data")
    @ApiResponse(responseCode = "200", description = "Expense updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    @ApiResponse(responseCode = "404", description = "Expense not found", content = @Content)
    public ResponseEntity<ExpenseDTO> updateExpense(
            @Parameter(description = "Expense ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated expense data", required = true, schema = @Schema(implementation = ExpenseDTO.class))
            @Valid @RequestBody ExpenseDTO expenseDTO) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expenseDTO));
    }

    /**
     * Delete an expense by its ID.
     *
     * @param id The ID of the expense to delete
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an expense", description = "Delete an expense by its ID")
    @ApiResponse(responseCode = "204", description = "Expense deleted successfully")
    @ApiResponse(responseCode = "400", description = "Expense has associated commitments", content = @Content)
    @ApiResponse(responseCode = "404", description = "Expense not found", content = @Content)
    public ResponseEntity<Void> deleteExpense(
            @Parameter(description = "Expense ID", required = true)
            @PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}