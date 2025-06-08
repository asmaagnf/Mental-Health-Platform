package micro.mentalhealth.project.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.net.URL;

@Embeddable
public class LienVisio {

    @Column(name = "lien_visio", length = 2048)
    private String url;

    public LienVisio() {
        // JPA requires a default constructor
    }

    public LienVisio(String url) {
        if (url == null || url.isEmpty()) {
            this.url = null;
            return;
        }
        validateUrl(url);
        this.url = url;
    }

    private void validateUrl(String url) {
        try {
            URL validatedUrl = new java.net.URI(url).toURL();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL format for LienVisio: " + url, e);
        }
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        if (url != null && !url.isEmpty()) {
            validateUrl(url);
        }
        this.url = url;
    }
}
