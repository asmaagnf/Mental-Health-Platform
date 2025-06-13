package micro.mentalhealth.project.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.*;
import micro.mentalhealth.project.service.PaymentService;
import com.itextpdf.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    @Autowired
    private  PaymentService paymentService;

    // Create a payment
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody CreatePaymentRequest request) {
        PaymentDTO createdPayment = paymentService.createPayment(request);
        return ResponseEntity.ok(createdPayment);
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable UUID id) {
        PaymentDTO payment = paymentService.getPayment(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/therapists/{therapistId}/earnings")
    public ResponseEntity<Double> getTherapistEarnings(@PathVariable UUID therapistId) {
        return ResponseEntity.ok(paymentService.getTherapistEarnings(therapistId));
    }

    @PutMapping("/therapists/{therapistId}/earnings")
    public ResponseEntity<Void> updateTherapistEarnings(
            @PathVariable UUID therapistId,
            @RequestParam double amount) {
        paymentService.updateTherapistEarnings(therapistId, amount);
        return ResponseEntity.ok().build();
    }
    // Get all payments
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/byseance/{seanceId}")
    public ResponseEntity<PaymentDTO> getPaymentBySeanceId(@PathVariable UUID seanceId) {
        try {
            PaymentDTO payment = paymentService.getPaymentBySeanceId(seanceId);
            return ResponseEntity.ok(payment);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete payment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable UUID id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{paymentId}/seance/{seanceId}")
    public ResponseEntity<Void> updateSeanceIdInPayment(@PathVariable UUID paymentId, @PathVariable UUID seanceId) {
        paymentService.updatePaymentWithSeanceId(paymentId, seanceId);
        return ResponseEntity.noContent().build();
    }

    // Get payments by patient ID
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByPatient(@PathVariable UUID patientId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByPatient(patientId);
        return ResponseEntity.ok(payments);
    }

    // Get payments by therapist ID
    @GetMapping("/therapist/{therapistId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByTherapist(@PathVariable UUID therapistId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByTherapist(therapistId);
        return ResponseEntity.ok(payments);
    }

    // Generate PDF receipt for a payment
    @GetMapping("/{paymentId}/receipt")
    public ResponseEntity<byte[]> generatePaymentReceiptPdf(@PathVariable UUID paymentId) {
        try {
            byte[] pdfBytes = paymentService.generatePaymentReceiptPdf(paymentId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "recu_paiement_" + paymentId + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (DocumentException | IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
}
