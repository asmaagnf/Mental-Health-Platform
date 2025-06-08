package micro.mentalhealth.project.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Pattern;

@Embeddable
public class PhoneNumber {

    @Pattern(regexp = "\\d{10}", message = "Phone number must be exactly 10 digits")
    private String number;

    public PhoneNumber() {}

    public PhoneNumber(String number) {
        if (number == null || !number.matches("\\d{10}")) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits");
        }
        this.number = number;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        if (number == null || !number.matches("\\d{10}")) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits");
        }
        this.number = number;
    }

    public String getValue() {
        return number;
    }
}
