package micro.mentalhealth.project.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiplomaDto {
    @NotBlank(message = "Diploma title cannot be blank")
    private String title;

    @NotBlank(message = "Institution cannot be blank")
    private String institution;

    @NotNull(message = "Year cannot be null")
    @Min(value = 1900, message = "Year must be after 1900")
    private Integer year;

    private String imageUrl; // URL to the diploma image
}