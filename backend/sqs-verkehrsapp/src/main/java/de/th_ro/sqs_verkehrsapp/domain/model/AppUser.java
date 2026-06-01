package de.th_ro.sqs_verkehrsapp.domain.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class AppUser {

    private UUID id;
    private String username;
    private String passwordHash;
}
