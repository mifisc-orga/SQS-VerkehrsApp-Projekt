package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * JPA entity for persisting traffic events in the local cache.
 * <p>
 * The entity stores traffic events retrieved from the Autobahn API
 * together with the timestamp of caching, allowing previously loaded
 * data to be used when the API is unavailable.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
