package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

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
