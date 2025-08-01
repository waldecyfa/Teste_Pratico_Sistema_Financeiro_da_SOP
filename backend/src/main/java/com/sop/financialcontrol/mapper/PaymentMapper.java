package com.sop.financialcontrol.mapper;

import com.sop.financialcontrol.dto.PaymentDTO;
import com.sop.financialcontrol.model.Commitment;
import com.sop.financialcontrol.model.Payment;
import org.mapstruct.*;

import java.util.List;

/**
 * Mapper for converting between Payment entity and PaymentDTO.
 */
@Mapper(componentModel = "spring")
public interface PaymentMapper {

    /**
     * Convert a Payment entity to a PaymentDTO.
     *
     * @param payment The Payment entity to convert
     * @return The resulting PaymentDTO
     */
    @Mapping(target = "commitmentId", source = "commitment.id")
    @Mapping(target = "commitmentNumber", source = "commitment.commitmentNumber")
    @Mapping(target = "commitmentAmount", source = "commitment.amount")
    @Mapping(target = "expenseId", source = "commitment.expense.id")
    @Mapping(target = "expenseProtocolNumber", source = "commitment.expense.protocolNumber")
    PaymentDTO toDto(Payment payment);

    /**
     * Convert a PaymentDTO to a Payment entity.
     *
     * @param paymentDTO The PaymentDTO to convert
     * @param commitment The associated Commitment entity
     * @return The resulting Payment entity
     */
    @Mapping(target = "commitment", source = "commitment")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Payment toEntity(PaymentDTO paymentDTO, Commitment commitment);      

    /**
     * Convert a list of Payment entities to a list of PaymentDTOs.
     *
     * @param payments The list of Payment entities to convert
     * @return The resulting list of PaymentDTOs
     */
    List<PaymentDTO> toDtoList(List<Payment> payments);

    /**
     * Update a Payment entity with data from a PaymentDTO.
     *
     * @param paymentDTO The PaymentDTO containing the new data
     * @param payment The Payment entity to update
     * @return The updated Payment entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "commitment", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Payment updateEntityFromDto(PaymentDTO paymentDTO, @MappingTarget Payment payment);
}