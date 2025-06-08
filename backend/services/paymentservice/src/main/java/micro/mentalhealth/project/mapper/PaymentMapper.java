package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.CreatePaymentRequest;
import micro.mentalhealth.project.dto.PaymentDTO;
import micro.mentalhealth.project.model.Payment;
import micro.mentalhealth.project.model.PaymentMethod;
import micro.mentalhealth.project.model.PaymentStatus;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public static Payment toEntity(CreatePaymentRequest dto) {
        Payment payment = new Payment();
        payment.setPatientId(dto.getPatientId());
        payment.setTherapistId(dto.getTherapistId());
        payment.setSeanceId(dto.getSeanceId());
        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(PaymentMethod.valueOf(dto.getPaymentMethod().toUpperCase()));
        payment.setPaymentStatus(PaymentStatus.EN_ATTENTE); // default status
        payment.setPaymentDate(java.time.LocalDateTime.now());
        return payment;
    }

    public static PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPatientId(payment.getPatientId());
        dto.setTherapistId(payment.getTherapistId());
        dto.setSeanceId(payment.getSeanceId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod().name());
        dto.setPaymentStatus(payment.getPaymentStatus().name());
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }
}
