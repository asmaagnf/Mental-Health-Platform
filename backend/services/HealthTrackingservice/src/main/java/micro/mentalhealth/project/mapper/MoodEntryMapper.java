package micro.mentalhealth.project.mapper;

import lombok.extern.slf4j.Slf4j;
import micro.mentalhealth.project.dto.mood.MoodEntryRequest;
import micro.mentalhealth.project.dto.mood.MoodEntryResponse;
import micro.mentalhealth.project.model.HumeurJournalisee;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;
@Slf4j
@Component
public class MoodEntryMapper {

    public HumeurJournalisee toHumeurJournalisee(MoodEntryRequest request) {
        if (request == null) {

            return null;
        }
        return new HumeurJournalisee(LocalDate.now(), request.getNiveau(), request.getNote());
    }

    public MoodEntryResponse toMoodEntryResponse(HumeurJournalisee humeur, UUID patientId) {
        if (humeur == null) {
            log.warn("MoodEntry is null when mapping to toMoodEntryResponse");
            return null;
        }
        return new MoodEntryResponse(
                humeur.getDate(),
                humeur.getNiveau(),
                humeur.getNote(),
                humeur.getTimestamp(),
                patientId
        );
    }
}
