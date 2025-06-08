package micro.mentalhealth.project.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Objects;

public class Rating {

        private final int value;

        public Rating(int value) {
                if (value < 1 || value > 5) {
                        throw new IllegalArgumentException("Rating must be between 1 and 5");
                }
                this.value = value;
        }

        public int value() {
                return value;
        }

        // equals et hashCode indispensables pour un VO
        @Override
        public boolean equals(Object o) {
                if (this == o) return true;
                if (!(o instanceof Rating)) return false;
                Rating rating = (Rating) o;
                return value == rating.value;
        }

        @Override
        public int hashCode() {
                return Objects.hash(value);
        }

        @Override
        public String toString() {
                return String.valueOf(value);
        }
}
