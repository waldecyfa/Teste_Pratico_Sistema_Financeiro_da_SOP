package com.sop.financialcontrol.mapper;

import com.sop.financialcontrol.dto.CommitmentDTO;
import com.sop.financialcontrol.model.Commitment;
import com.sop.financialcontrol.model.Expense;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Mapper for converting between Commitment entity and CommitmentDTO.
 */
@Mapper(componentModel = "spring", uses = {PaymentMapper.class})
public interface CommitmentMapper {

    /**
     * Convert a Commitment entity to a CommitmentDTO.
     *
     * @param commitment The Commitment entity to convert
     * @return The resulting CommitmentDTO
     */
    @Mapping(target = "expenseId", source = "expense.id")
    @Mapping(target = "expenseProtocolNumber", source = "expense.protocolNumber")
    @Mapping(target = "expenseAmount", source = "expense.amount")
    @Mapping(target = "totalPaidAmount", ignore = true)
    @Mapping(target = "remainingAmount", ignore = true)
    @Mapping(target = "paymentCount", expression = "java(commitment.getPayments().size())")
    CommitmentDTO toDto(Commitment commitment);

    /**
     * Convert a CommitmentDTO to a Commitment entity.
     *
     * @param commitmentDTO The CommitmentDTO to convert
     * @param expense The associated Expense entity
     * @return The resulting Commitment entity
     */
    @Mapping(target = "expense", source = "expense")
    @Mapping(target = "payments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Commitment toEntity(CommitmentDTO commitmentDTO, Expense expense);

    /**
     * Convert a list of Commitment entities to a list of CommitmentDTOs.
     *
     * @param commitments The list of Commitment entities to convert
     * @return The resulting list of CommitmentDTOs
     */
    List<CommitmentDTO> toDtoList(List<Commitment> commitments);

    /**
     * Update a Commitment entity with data from a CommitmentDTO.
     *
     * @param commitmentDTO The CommitmentDTO containing the new data
     * @param commitment The Commitment entity to update
     * @return The updated Commitment entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "expense", ignore = true)
    @Mapping(target = "payments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Commitment updateEntityFromDto(CommitmentDTO commitmentDTO, @MappingTarget Commitment commitment);

    /**
     * After mapping, calculate additional fields for the DTO.
     *
     * @param commitmentDTO The CommitmentDTO to update
     * @param commitment The source Commitment entity
     */
    @AfterMapping
    default void calculateAdditionalFields(@MappingTarget CommitmentDTO commitmentDTO, Commitment commitment) {
        BigDecimal totalPaid = commitment.getTotalPaidAmount();
        
        commitmentDTO.setTotalPaidAmount(totalPaid);
        commitmentDTO.setRemainingAmount(commitment.getAmount().subtract(totalPaid));
    }
}