package micro.mentalhealth.project.controller;

import micro.mentalhealth.project.dto.FeedbackDTO;
import micro.mentalhealth.project.mapper.FeedbackMapper;
import micro.mentalhealth.project.model.Feedback;
import micro.mentalhealth.project.service.FeedbackService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }
    // Créer un feedback
    @PostMapping
    public FeedbackDTO createFeedback(@RequestBody @Valid FeedbackDTO dto) {
        Feedback feedback = FeedbackMapper.toEntity(dto);
        Feedback saved = feedbackService.createFeedback(feedback);
        return FeedbackMapper.toDTO(saved);
    }

    // Lister tous les feedbacks
    @GetMapping
    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks()
                .stream()
                .map(FeedbackMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Récupérer un feedback par ID
    @GetMapping("/{id}")
    public FeedbackDTO getFeedbackById(@PathVariable UUID id) {
        Feedback feedback = feedbackService.getFeedbackById(id)
                .orElseThrow(() -> new RuntimeException("Feedback introuvable avec l'ID : " + id));
        return FeedbackMapper.toDTO(feedback);
    }

    // Supprimer un feedback
    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable UUID id) {
        feedbackService.deleteFeedback(id);
    }

    // Lister les feedbacks d’un thérapeute
    @GetMapping("/therapist/{therapistId}")
    public List<FeedbackDTO> getFeedbacksByTherapist(@PathVariable UUID therapistId) {
        return feedbackService.getFeedbacksByTherapist(therapistId)
                .stream()
                .map(FeedbackMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Obtenir la note moyenne d’un thérapeute
    @GetMapping("/therapist/{therapistId}/average")
    public Double getAverageRating(@PathVariable UUID therapistId) {
        return feedbackService.getAverageRating(therapistId);
    }
}
