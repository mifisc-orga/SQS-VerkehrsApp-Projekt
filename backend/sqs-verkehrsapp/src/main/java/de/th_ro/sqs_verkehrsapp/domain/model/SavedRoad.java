package de.th_ro.sqs_verkehrsapp.domain.model;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Domain model representing a motorway saved by a user.
 * <p>
 * Associates a user with a motorway that has been saved
 * as a favorite.
 */
@Getter
@Builder
@AllArgsConstructor
public class SavedRoad {

    private UUID id;
    private UUID userId;

    private String roadId;
}
