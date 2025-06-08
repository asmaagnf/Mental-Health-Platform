package micro.mentalhealth.project.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class PaymentDTO {
    private UUID id;
    private UUID patientId;
    private UUID therapistId;
    private UUID seanceId;
    private Float amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paymentDate;

    public PaymentDTO() {}

    public PaymentDTO(UUID id, UUID patientId, UUID therapistId, UUID seanceId, Float amount, String paymentMethod, String paymentStatus, LocalDateTime paymentDate) {
        this.id = id;
        this.patientId = patientId;
        this.therapistId = therapistId;
        this.seanceId = seanceId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public UUID getTherapistId() {
        return therapistId;
    }

    public void setTherapistId(UUID therapistId) {
        this.therapistId = therapistId;
    }

    public UUID getSeanceId() {
        return seanceId;
    }

    public void setSeanceId(UUID seanceId) {
        this.seanceId = seanceId;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}
