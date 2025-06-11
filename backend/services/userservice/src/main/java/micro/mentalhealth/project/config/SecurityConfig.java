package micro.mentalhealth.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import java.util.List;

@Configuration
@EnableWebSecurity // Active la sécurité Web dans l'application
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configuration des options de sécurité
        http.csrf(AbstractHttpConfigurer::disable) // Désactive la protection CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Ajoute la configuration CORS ici
                .authorizeHttpRequests(authorize -> authorize // Configuration des autorisations d'accès
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/user/**","/**").permitAll() // Autorise l'accès à ces endpoints pour tous
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Autorise l'accès aux endpoints admin uniquement pour les utilisateurs avec le rôle ADMIN
                        .requestMatchers("/api/therapist/**").hasRole("THERAPIST") // Autorise l'accès aux endpoints résident uniquement pour les utilisateurs avec le rôle RESIDENT
                        .anyRequest().authenticated()); // Toutes les autres requêtes nécessitent une authentification

        return http.build(); // Construit la configuration de sécurité
    }



    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Définit l'encodeur de mot de passe à utiliser
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autorise l'origine de votre frontend
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Autorise tous les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
        configuration.setAllowedMethods(List.of("*"));

        // Autorise tous les en-têtes
        configuration.setAllowedHeaders(List.of("*"));

        // Autorise les cookies si nécessaire
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Applique cette configuration globalement pour tous les endpoints
        source.registerCorsConfiguration("/**", configuration);

        return source; // Retourne la source de configuration CORS
    }
}
