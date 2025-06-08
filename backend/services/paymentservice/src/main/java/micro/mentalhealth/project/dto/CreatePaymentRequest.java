package micro.mentalhealth.project.dto;

import java.util.UUID;

public class CreatePaymentRequest {
    private UUID patientId;
    private UUID therapistId;
    private UUID seanceId;
    private Float amount;
    private String paymentMethod;

    public CreatePaymentRequest() {}

    public CreatePaymentRequest(UUID patientId, UUID therapistId, UUID seanceId, Float amount, String paymentMethod) {
        this.patientId = patientId;
        this.therapistId = therapistId;
        this.seanceId = seanceId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
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
}
