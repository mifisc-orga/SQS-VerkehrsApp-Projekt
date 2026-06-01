package de.th_ro.sqs_verkehrsapp.application.port.in;

import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;

public interface AuthUseCase {

    AppUser register(String username, String password);

    AppUser login(String username, String password);
}
