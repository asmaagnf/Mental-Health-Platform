package micro.mentalhealth.project.service;

import micro.mentalhealth.project.model.SymptomeJournalier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalculTendanceSymptomeService {

    public double calculerTendance(List<SymptomeJournalier> symptomesRecent, int periodInDays) {
        if (symptomesRecent == null || symptomesRecent.isEmpty() || periodInDays <= 1) {
            return 0.0;
        }

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(periodInDays - 1);

        List<SymptomeJournalier> filteredSymptoms = symptomesRecent.stream()
                .filter(s -> !s.getDate().isBefore(startDate) && !s.getDate().isAfter(endDate))
                .sorted((s1, s2) -> s1.getDate().compareTo(s2.getDate()))
                .collect(Collectors.toList());

        if (filteredSymptoms.size() < 2) {
            return 0.0;
        }

        double sumX = 0;
        double sumY = 0;
        double sumXY = 0;
        double sumX2 = 0;
        int n = filteredSymptoms.size();

        for (int i = 0; i < n; i++) {
            double x = i;
            // Correction: Utiliser getValeur() au lieu de getValleur()
            double y = filteredSymptoms.get(i).getIntensite().getValeur();

            sumX += x;
            sumY += y;
            sumXY += (x * y);
            sumX2 += (x * x);
        }

        double numerator = (n * sumXY - sumX * sumY);
        double denominator = (n * sumX2 - sumX * sumX);

        if (denominator == 0) {
            return 0.0;
        }

        double slope = numerator / denominator;

        double initialValue = filteredSymptoms.get(0).getIntensite().getValeur(); // Correction ici aussi
        double finalValue = filteredSymptoms.get(n - 1).getIntensite().getValeur(); // Correction ici aussi

        if (initialValue == 0) {
            return (finalValue > 0) ? 100.0 : 0.0;
        }

        return ((finalValue - initialValue) / initialValue) * 100.0;
    }
}
