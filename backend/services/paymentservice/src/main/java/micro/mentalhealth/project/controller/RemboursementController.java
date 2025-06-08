package micro.mentalhealth.project.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.CreateRemboursementRequest;
import micro.mentalhealth.project.dto.RemboursementDTO;
import micro.mentalhealth.project.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/remboursements")
@RequiredArgsConstructor
public class RemboursementController {
    @Autowired
    private  PaymentService paymentService;

    // Create a remboursement (refund)
    @PostMapping
    public ResponseEntity<RemboursementDTO> createRemboursement(@RequestBody CreateRemboursementRequest request) {
        try {
            RemboursementDTO created = paymentService.createRemboursement(request);
            return ResponseEntity.ok(created);
        } catch (EntityNotFoundException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get remboursement by ID
    @GetMapping("/{id}")
    public ResponseEntity<RemboursementDTO> getRemboursement(@PathVariable UUID id) {
        try {
            RemboursementDTO remboursement = paymentService.getRemboursement(id);
            return ResponseEntity.ok(remboursement);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all remboursements
    @GetMapping
    public ResponseEntity<List<RemboursementDTO>> getAllRemboursements() {
        List<RemboursementDTO> remboursements = paymentService.getAllRemboursements();
        return ResponseEntity.ok(remboursements);
    }

    // Delete remboursement by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRemboursement(@PathVariable UUID id) {
        paymentService.deleteRemboursement(id);
        return ResponseEntity.noContent().build();
    }
}
