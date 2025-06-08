package micro.mentalhealth.project.mapper;

import lombok.extern.slf4j.Slf4j;
import micro.mentalhealth.project.dto.symptom.SymptomHistoryEntry;
import micro.mentalhealth.project.dto.symptom.SymptomResponse;
import micro.mentalhealth.project.model.SymptomeJournalier;
import micro.mentalhealth.project.model.SymptomeSuivi;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
public class SymptomMapper {

    public SymptomResponse toSymptomResponse(SymptomeSuivi symptomeSuivi, UUID patientId) {
        if (symptomeSuivi == null) {
            log.warn("SymptomeSuivi is null when mapping to SymptomResponse");
            return null;
        }
        // Assuming SymptomResponse constructor matches (nom, patientId) based on DTO snippet
        return new SymptomResponse(symptomeSuivi.getNom(), patientId);
    }

    public SymptomHistoryEntry toSymptomHistoryEntry(SymptomeJournalier symptomeJournalier) {
        if (symptomeJournalier == null) {
            return null;
        }
        return new SymptomHistoryEntry(
                symptomeJournalier.getDate(),
                symptomeJournalier.getIntensite().getValeur(),
                symptomeJournalier.getTimestamp()
        );
    }

    public List<SymptomHistoryEntry> toSymptomHistoryEntryList(List<SymptomeJournalier> journaux) {
        if (journaux == null) {
            return null;
        }
        return journaux.stream()
                .map(this::toSymptomHistoryEntry)
                .collect(Collectors.toList());
    }
}
