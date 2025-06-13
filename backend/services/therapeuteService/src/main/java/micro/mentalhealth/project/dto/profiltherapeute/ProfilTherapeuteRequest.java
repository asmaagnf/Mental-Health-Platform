package micro.mentalhealth.project.dto.profiltherapeute;

import micro.mentalhealth.project.dto.common.DiplomaDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfilTherapeuteRequest {
    @NotEmpty(message = "Specialties cannot be empty")
    private List<String> specialites;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Years of experience cannot be null")
    @Min(value = 0, message = "Years of experience must be 0 or greater")
    private Integer anneesExperience;

    @Valid
    private List<DiplomaDto> diplomas;

    @NotEmpty(message = "Spoken languages cannot be empty")
    private List<String> languesParlees;

    @NotBlank(message = "Location cannot be blank")
    private String localisation;

    @NotNull(message = "Availability status cannot be null")
    private Boolean available;

    @NotNull(message = "Price per hour cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per hour must be greater than 0")
    private Double prixParHeure;
}
