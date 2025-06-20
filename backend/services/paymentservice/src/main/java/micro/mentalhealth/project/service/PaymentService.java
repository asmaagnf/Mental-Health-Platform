package micro.mentalhealth.project.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.*;
import micro.mentalhealth.project.mapper.PaymentMapper;
import micro.mentalhealth.project.mapper.RemboursementMapper;
import micro.mentalhealth.project.model.*;
import micro.mentalhealth.project.repository.PaymentRepository;
import micro.mentalhealth.project.repository.RemboursementRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import micro.mentalhealth.project.repository.TherapistEarningsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    @Autowired
    private  PaymentRepository paymentRepository;
    @Autowired
    private  RemboursementRepository remboursementRepository;
    @Autowired
    private NotificationProducer notificationProducer;

    private final TherapistEarningsRepository therapistEarningsRepository;

    // ------------------ PAYMENT ------------------

    public PaymentDTO createPayment(CreatePaymentRequest request) {
        Payment payment = PaymentMapper.toEntity(request);
        payment.setPaymentStatus(PaymentStatus.REUSSI); // For manual project, assume always successful
        Payment saved = paymentRepository.save(payment);
        // Add notification
        String patientMsg = "Payment of " + request.getAmount() + " confirmed";
        NotificationRequest notification = new NotificationRequest(
                request.getPatientId(),
                patientMsg,
                NotificationType.PAYMENT_CONFIRMED,
                saved.getId()
        );
        notificationProducer.sendNotification(notification);
        updateTherapistEarnings(request.getTherapistId(), request.getAmount());
        return PaymentMapper.toDTO(saved);
    }

    public void updateTherapistEarnings(UUID therapistId, double amount) {
        TherapistEarnings earnings = therapistEarningsRepository.findByTherapistId(therapistId)
                .orElseGet(() -> {
                    TherapistEarnings newEarnings = new TherapistEarnings();
                    newEarnings.setTherapistId(therapistId);
                    return therapistEarningsRepository.save(newEarnings);
                });

        earnings.setTotalEarnings(earnings.getTotalEarnings() + amount);
        therapistEarningsRepository.save(earnings);
    }
    @Transactional
    public void updatePaymentWithSeanceId(UUID paymentId, UUID seanceId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));

        payment.setSeanceId(seanceId);
        paymentRepository.save(payment); // optional with @Transactional if entity is managed
    }

    public PaymentDTO getPayment(UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé"));
        return PaymentMapper.toDTO(payment);
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void deletePayment(UUID id) {
        paymentRepository.deleteById(id);
    }

    public List<PaymentDTO> getPaymentsByPatient(UUID patientId) {
        List<Payment> payments = paymentRepository.findByPatientId(patientId);
        return payments.stream()
                .map(PaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByTherapist(UUID therapistId) {
        List<Payment> payments = paymentRepository.findByTherapistId(therapistId);
        return payments.stream()
                .map(PaymentMapper::toDTO)
                .collect(Collectors.toList());
    }
    public PaymentDTO getPaymentBySeanceId(UUID seanceId) {
        Payment payment = paymentRepository.findBySeanceId(seanceId)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé pour la séance donnée"));
        return PaymentMapper.toDTO(payment);
    }
    // ------------------ FACTURE ------------------

    public byte[] generatePaymentReceiptPdf(UUID paymentId) throws DocumentException, IOException {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Paiement non trouvé"));

        // Check if payment status is successful
        if (payment.getPaymentStatus() != PaymentStatus.REUSSI) {
            throw new IllegalStateException("Le paiement n'est pas réussi, le reçu ne peut pas être généré.");
        }
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);

        document.open();

        // Add your receipt content here
        document.add(new Paragraph("Reçu de Paiement"));
        document.add(new Paragraph("ID Paiement : " + payment.getId()));
        document.add(new Paragraph("Patient ID : " + payment.getPatientId()));
        document.add(new Paragraph("Therapeut ID : " + payment.getTherapistId()));
        document.add(new Paragraph("Séance ID : " + payment.getSeanceId()));
        document.add(new Paragraph("Montant : " + payment.getAmount() + " MAD"));
        document.add(new Paragraph("Méthode de paiement : " + payment.getPaymentMethod()));
        document.add(new Paragraph("Statut du paiement : " + payment.getPaymentStatus()));
        document.add(new Paragraph("Date du paiement : " + payment.getPaymentDate()));

        document.close();

        return outputStream.toByteArray();
    }

    // ------------------ REMBOURSEMENT ------------------

    @Transactional
    public RemboursementDTO createRemboursement(CreateRemboursementRequest request) {
        Payment payment = paymentRepository.findById(request.getPaiementId())
                .orElseThrow(() -> new EntityNotFoundException("Paiement introuvable"));

        if (request.getMontant() > payment.getAmount()) {
            throw new IllegalArgumentException("Montant du remboursement > montant du paiement");
        }

        // Create refund
        Remboursement remboursement = RemboursementMapper.toEntity(request);
        Remboursement saved = remboursementRepository.save(remboursement);

        // Update payment status
        payment.setPaymentStatus(PaymentStatus.REMBOURSE);
        paymentRepository.save(payment);

        // Deduct from therapist earnings
        deductFromEarnings(payment.getTherapistId(), request.getMontant());
        String patientMsg = "Your refund of " + request.getMontant() + " has been processed";
        NotificationRequest notification = new NotificationRequest(
                payment.getPatientId(),
                patientMsg,
                NotificationType.PAYMENT_REFUNDED,
                payment.getId()
        );
        notificationProducer.sendNotification(notification);
        return RemboursementMapper.toDTO(saved);
    }

    private void deductFromEarnings(UUID therapistId, double amount) {
        TherapistEarnings earnings = therapistEarningsRepository.findByTherapistId(therapistId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist earnings record not found"));

        earnings.setTotalEarnings(earnings.getTotalEarnings() - amount);
        therapistEarningsRepository.save(earnings);
    }

    public double getTherapistEarnings(UUID therapistId) {
        return therapistEarningsRepository.findByTherapistId(therapistId)
                .map(TherapistEarnings::getTotalEarnings)
                .orElse(0.0);
    }

    public RemboursementDTO getRemboursement(UUID id) {
        Remboursement remboursement = remboursementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Remboursement non trouvé"));
        return RemboursementMapper.toDTO(remboursement);
    }

    public List<RemboursementDTO> getAllRemboursements() {
        return remboursementRepository.findAll().stream()
                .map(RemboursementMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteRemboursement(UUID id) {
        remboursementRepository.deleteById(id);
    }
}
