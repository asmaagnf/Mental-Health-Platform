package micro.mentalhealth.project.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Service
public class JwtUtil {

    // Lire la clé secrète et le temps d'expiration à partir de la configuration
    @Value("${jwt.secret.key}") // Passer une clé encodée en Base64
    private String secretKey;

    @Value("${jwt.token.expiration}") // Par défaut 10 heures (en millisecondes) si non spécifié
    private Long expirationTime;

    private Key signingKey;

    // Initialiser la clé de signature
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey); // Décoder la clé secrète
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("La clé secrète n'est pas suffisamment longue. Longueur minimale : 256 bits (32 octets).");
        }
        signingKey = Keys.hmacShaKeyFor(keyBytes); // Créer la clé de signature HMAC
    }

    /**
     * Générer un token JWT avec le nom d'utilisateur, le rôle et l'ID utilisateur
     */
    public String generateToken(String username, String role, Long userId) {
        return Jwts.builder()
                .claim("role", role)          // Ajouter la revendication de rôle
                .claim("userId", userId)      // Ajouter la revendication d'ID utilisateur
                .setSubject(username)         // Ajouter le sujet (nom d'utilisateur)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Heure d'émission
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Heure d'expiration
                .signWith(signingKey, SignatureAlgorithm.HS256) // Signer avec la clé et l'algorithme
                .compact(); // Générer le token
    }

    /**
     * Extraire toutes les revendications d'un token JWT
     */
    public Claims extractClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(signingKey) // Définir la clé de signature
                    .build()
                    .parseClaimsJws(token)    // Analyser le token
                    .getBody();               // Extraire le corps du token
        } catch (JwtException e) {
            // Journaliser et gérer l'exception (la journalisation peut être ajoutée si nécessaire)
            throw new IllegalStateException("Token JWT invalide", e);
        }
    }

    /**
     * Extraire le nom d'utilisateur (sujet) d'un token JWT
     */
    public String extractUsername(String token) {
        return extractClaims(token).getSubject(); // Le sujet est le nom d'utilisateur
    }

    /**
     * Extraire le rôle d'un token JWT
     */
    public String extractRole(String token) {
        return (String) extractClaims(token).get("role"); // Extraire la revendication "role"
    }

    /**
     * Extraire l'ID utilisateur d'un token JWT
     */
    public Long extractUserId(String token) {
        return ((Number) extractClaims(token).get("userId")).longValue(); // Extraire la revendication "userId"
    }

    /**
     * Vérifier si un token JWT est expiré
     */
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date()); // Comparer la date d'expiration
    }
}
