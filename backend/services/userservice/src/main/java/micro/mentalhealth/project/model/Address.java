package micro.mentalhealth.project.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class Address {

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String postalCode;

    @NotBlank
    private String country;

    // Constructors
    public Address() {}

    public Address(String street, String city, String state, String postalCode, String country) {
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
    }
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        if (street != null && !street.isEmpty()) sb.append(street).append(", ");
        if (city != null && !city.isEmpty()) sb.append(city).append(", ");
        if (postalCode != null && !postalCode.isEmpty()) sb.append(postalCode).append(", ");
        if (country != null && !country.isEmpty()) sb.append(country);

        // Remove trailing comma and space if present
        String result = sb.toString().trim();
        if (result.endsWith(",")) {
            result = result.substring(0, result.length() - 1);
        }
        return result;
    }
    public static Address fromString(String addressString) {
        if (addressString == null || addressString.isEmpty()) {
            return null;
        }
        String[] parts = addressString.split(",");
        Address address = new Address();
        if (parts.length > 0) address.street = parts[0].trim();
        if (parts.length > 1) address.city = parts[1].trim();
        if (parts.length > 2) address.postalCode = parts[3].trim();
        if (parts.length > 3) address.country = parts[4].trim();
        return address;
    }


    // Getters and setters

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
