package de.th_ro.sqs_verkehrsapp.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class SavedRoad {

    private UUID id;
    private UUID userId;

    private String roadId;
}
