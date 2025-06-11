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

    // Fixed constructor (removed 'state' parameter since it's not a field)
    public Address(String street, String city, String postalCode, String country) {
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

        // Split and trim all parts automatically
        String[] parts = addressString.trim().split("\\s*,\\s*");

        // Validate we have all required components
        if (parts.length < 4) {
            throw new IllegalArgumentException(
                    "Address string must contain all components in format: street, city, postalCode, country");
        }

        Address address = new Address();
        address.street = parts[0];
        address.city = parts[1];
        address.postalCode = parts[2];
        address.country = parts[3];

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

    // Optional: Equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Address address = (Address) o;

        if (!street.equals(address.street)) return false;
        if (!city.equals(address.city)) return false;
        if (!postalCode.equals(address.postalCode)) return false;
        return country.equals(address.country);
    }

    @Override
    public int hashCode() {
        int result = street.hashCode();
        result = 31 * result + city.hashCode();
        result = 31 * result + postalCode.hashCode();
        result = 31 * result + country.hashCode();
        return result;
    }
}