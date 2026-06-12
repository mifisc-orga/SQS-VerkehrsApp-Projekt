package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity;


import jakarta.persistence.*;
import java.util.UUID;
import lombok.*;

/**
 * JPA entity for motorways saved by a user.
 * <p>
 * Each instance associates a user with a motorway that has been saved
 * as a favorite. The unique constraint ensures that a motorway can only
 * be saved once per user.
 */
@Entity
@Table(
        name = "saved_roads",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "road_id"})
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedRoadEntity {

    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "road_id", nullable = false)
    private String roadId;
}
