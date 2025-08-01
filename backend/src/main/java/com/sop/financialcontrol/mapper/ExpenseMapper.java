package com.sop.financialcontrol.mapper;

import com.sop.financialcontrol.dto.ExpenseDTO;
import com.sop.financialcontrol.model.Expense;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Mapper for converting between Expense entity and ExpenseDTO.
 */
@Mapper(componentModel = "spring", uses = {CommitmentMapper.class})
public interface ExpenseMapper {

    /**
     * Convert an Expense entity to an ExpenseDTO.
     *
     * @param expense The Expense entity to convert
     * @return The resulting ExpenseDTO
     */
    @Mapping(target = "totalCommittedAmount", ignore = true)
    @Mapping(target = "totalPaidAmount", ignore = true)
    @Mapping(target = "remainingAmount", ignore = true)
    @Mapping(target = "commitmentCount", expression = "java(expense.getCommitments().size())")
    ExpenseDTO toDto(Expense expense);

    /**
     * Convert an ExpenseDTO to an Expense entity.
     *
     * @param expenseDTO The ExpenseDTO to convert
     * @return The resulting Expense entity
     */
    @Mapping(target = "commitments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Expense toEntity(ExpenseDTO expenseDTO);

    /**
     * Convert a list of Expense entities to a list of ExpenseDTOs.
     *
     * @param expenses The list of Expense entities to convert
     * @return The resulting list of ExpenseDTOs
     */
    List<ExpenseDTO> toDtoList(List<Expense> expenses);

    /**
     * Update an Expense entity with data from an ExpenseDTO.
     *
     * @param expenseDTO The ExpenseDTO containing the new data
     * @param expense The Expense entity to update
     * @return The updated Expense entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "commitments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Expense updateEntityFromDto(ExpenseDTO expenseDTO, @MappingTarget Expense expense);

    /**
     * After mapping, calculate additional fields for the DTO.
     *
     * @param expenseDTO The ExpenseDTO to update
     * @param expense The source Expense entity
     */
    @AfterMapping
    default void calculateAdditionalFields(@MappingTarget ExpenseDTO expenseDTO, Expense expense) {
        BigDecimal totalCommitted = expense.getTotalCommittedAmount();
        BigDecimal totalPaid = expense.getTotalPaidAmount();
        
        expenseDTO.setTotalCommittedAmount(totalCommitted);
        expenseDTO.setTotalPaidAmount(totalPaid);
        expenseDTO.setRemainingAmount(expense.getAmount().subtract(totalPaid));
    }
}