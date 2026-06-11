package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPA entity for persisting traffic events in the local cache.
 * <p>
 * The entity stores traffic events retrieved from the Autobahn API
 * together with the timestamp of caching, allowing previously loaded
 * data to be used when the API is unavailable.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
public class CachedRoadEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roadId;
    private String eventId;
    private String title;
    private String subtitle;
    private String type;
    private double latitude;
    private double longitude;
    private LocalDateTime cachedAt;

    /**
     * Creates a new cache entity for a traffic event.
     */
    public CachedRoadEventEntity(
            String roadId,
            String eventId,
            String title,
            String subtitle,
            String type,
            double latitude,
            double longitude,
            LocalDateTime cachedAt
    ) {
        this.roadId = roadId;
        this.eventId = eventId;
        this.title = title;
        this.subtitle = subtitle;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.cachedAt = cachedAt;
    }
}
