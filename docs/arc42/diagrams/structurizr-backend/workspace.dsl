workspace "SQS Verkehrsapp" "C4-Modelle für die arc42-Dokumentation der SQS Verkehrsapp" {

    model {
        user = person "Benutzer" "Ruft Verkehrsdaten ab, verwaltet gespeicherte Autobahnen und nutzt das Dashboard."

        sqs = softwareSystem "SQS Verkehrsapp" "Webbasierte Anwendung zur Bereitstellung, Bewertung und Verwaltung von Verkehrsinformationen." {
            frontend = container "Frontend" "Browserbasierte Benutzeroberfläche für Verkehrsdaten, Login, Favoriten und Dashboard." "React, TypeScript, Vite"

            backend = container "Backend" "REST API, Fachlogik, Authentifizierung, Caching und Integration externer Systeme." "Java 21, Spring Boot" {
                authController = component "AuthController" "REST-Endpunkte für Registrierung und Anmeldung." "Spring REST Controller"
                trafficController = component "TrafficController" "REST-Endpunkte zum Abruf von Verkehrsdaten." "Spring REST Controller"
                savedRoadController = component "SavedRoadController" "REST-Endpunkte zur Verwaltung gespeicherter Autobahnen." "Spring REST Controller"
                dashboardController = component "DashboardController" "REST-Endpunkt für personalisierte Dashboard-Daten." "Spring REST Controller"
                globalExceptionHandler = component "GlobalExceptionHandler" "Zentrale Fehlerbehandlung und einheitliche API-Fehlerantworten." "Spring RestControllerAdvice"

                authService = component "AuthService" "Registrierung, Login und Passwortprüfung." "Application Service"
                trafficService = component "TrafficService" "Abruf, Verarbeitung und Risikobewertung von Verkehrsdaten." "Application Service"
                savedRoadService = component "SavedRoadService" "Speichern, Abrufen und Löschen favorisierter Autobahnen." "Application Service"
                dashboardService = component "DashboardTrafficService" "Aggregiert gespeicherte Autobahnen mit zugehörigen Verkehrsdaten." "Application Service"

                domainModel = component "Domain Model" "AppUser, SavedRoad, RoadEvent, TrafficEventsResult, Coordinate." "Domain Layer"
                riskScoreCalculator = component "RiskScoreCalculator" "Berechnet Risikostufen und normierte Risikoscores." "Domain Service"

                userPort = component "UserPort" "Abstraktion für Benutzerpersistenz." "Output Port"
                savedRoadPort = component "SavedRoadPort" "Abstraktion für Favoritenpersistenz." "Output Port"
                autobahnApiPort = component "AutobahnApiPort" "Abstraktion für Verkehrsdatenzugriffe." "Output Port"
                roadEventCachePort = component "RoadEventCachePort" "Abstraktion für Verkehrsdaten-Cache." "Output Port"
                availableRoadCachePort = component "AvailableRoadCachePort" "Abstraktion für Autobahnlisten-Cache." "Output Port"

                userAdapter = component "UserAdapter" "Implementiert Benutzerpersistenz über Repository." "Persistence Adapter"
                savedRoadAdapter = component "SavedRoadAdapter" "Implementiert Favoritenpersistenz über Repository." "Persistence Adapter"
                roadEventCacheAdapter = component "RoadEventCacheAdapter" "Implementiert Verkehrsdaten-Cache über Datenbank." "Cache Adapter"
                availableRoadsCacheAdapter = component "AvailableRoadsCacheAdapter" "Implementiert Autobahnlisten-Cache über Datenbank." "Cache Adapter"

                resilientApiAdapter = component "ResilientAutobahnApiAdapter" "Kapselt Zugriff auf die Autobahn API inklusive Retry, Circuit Breaker und Cache-Fallback." "API Adapter"
                autobahnApiClient = component "AutobahnApiClient" "Führt HTTP-Aufrufe gegen die externe Autobahn API aus." "Spring WebClient"
                autobahnApiMapper = component "AutobahnApiMapper" "Transformiert externe DTOs in Domänenobjekte." "Mapper"
                autobahnCacheWriter = component "AutobahnCacheWriter" "Schreibt Verkehrsdaten asynchron in den Cache." "Async Cache Writer"

                jwtFilter = component "JwtAuthenticationFilter" "Validiert Bearer Tokens und setzt die Authentication im Security Context." "Spring Security Filter"
                jwtService = component "JwtService" "Erzeugt und validiert JWTs." "Security Service"
                securityConfig = component "SecurityConfig" "Konfiguriert öffentliche und geschützte Endpunkte." "Spring Security Configuration"
            }

            database = container "Relationale Datenbank" "Speichert Benutzer, gespeicherte Autobahnen, Verkehrsdaten-Cache und Autobahnlisten-Cache." "PostgreSQL / H2" {
                tags "Database"
            }
        }

        autobahnApi = softwareSystem "Autobahn API" "Externe Quelle für Warnungen, Baustellen, Sperrungen und verfügbare Autobahnen." {
            tags "External"
        }

        githubActions = softwareSystem "GitHub Actions" "CI-Pipeline für Build, Tests, Coverage und Qualitätsprüfungen." {
            tags "External"
        }

        teamscale = softwareSystem "Teamscale" "Qualitätsüberwachung und Testwise Coverage." {
            tags "External"
        }

        sonarCloud = softwareSystem "SonarCloud" "Statische Codeanalyse und Quality Gate." {
            tags "External"
        }

        user -> sqs "Nutzt Verkehrsinformationen, Favoriten und Dashboard" "HTTPS"
        user -> frontend "Interagiert mit" "Browser"
        frontend -> backend "Ruft REST API auf" "HTTPS/JSON"
        backend -> database "Liest und schreibt Benutzer-, Favoriten- und Cache-Daten" "JPA/JDBC"
        backend -> autobahnApi "Ruft Verkehrsdaten ab" "HTTP/JSON"
        githubActions -> teamscale "Übermittelt Test- und Coverage-Daten"
        githubActions -> sonarCloud "Startet statische Analyse"

        authController -> authService "verwendet"
        authController -> jwtService "erstellt JWT"
        trafficController -> trafficService "verwendet"
        savedRoadController -> savedRoadService "verwendet"
        dashboardController -> dashboardService "verwendet"

        jwtFilter -> jwtService "validiert Token"
        securityConfig -> jwtFilter "registriert Filter"

        authService -> userPort "verwendet"
        trafficService -> autobahnApiPort "verwendet"
        trafficService -> riskScoreCalculator "berechnet Score"
        savedRoadService -> savedRoadPort "verwendet"
        dashboardService -> savedRoadPort "lädt Favoriten"
        dashboardService -> autobahnApiPort "lädt Verkehrsdaten"

        authService -> domainModel "verwendet"
        trafficService -> domainModel "verwendet"
        savedRoadService -> domainModel "verwendet"
        dashboardService -> domainModel "verwendet"
        riskScoreCalculator -> domainModel "bewertet"

        userPort -> userAdapter "implementiert durch"
        savedRoadPort -> savedRoadAdapter "implementiert durch"
        roadEventCachePort -> roadEventCacheAdapter "implementiert durch"
        availableRoadCachePort -> availableRoadsCacheAdapter "implementiert durch"
        autobahnApiPort -> resilientApiAdapter "implementiert durch"

        userAdapter -> database "liest/schreibt Benutzer" "JPA/JDBC"
        savedRoadAdapter -> database "liest/schreibt Favoriten" "JPA/JDBC"
        roadEventCacheAdapter -> database "liest/schreibt Verkehrsdaten-Cache" "JPA/JDBC"
        availableRoadsCacheAdapter -> database "liest/schreibt Autobahnlisten-Cache" "JPA/JDBC"

        resilientApiAdapter -> autobahnApiClient "ruft API-Client auf"
        resilientApiAdapter -> roadEventCachePort "Fallback Verkehrsdaten"
        resilientApiAdapter -> availableRoadCachePort "Fallback Autobahnlisten"
        resilientApiAdapter -> autobahnCacheWriter "aktualisiert Cache asynchron"
        autobahnApiClient -> autobahnApi "sendet Requests" "HTTP/JSON"
        autobahnApiClient -> autobahnApiMapper "mapped DTOs"
        autobahnCacheWriter -> roadEventCachePort "speichert Events"

        development = deploymentEnvironment "Development" {
            clientDevice = deploymentNode "Client-Gerät" "Browser des Benutzers" "Desktop / Mobile Browser" {
                frontendInstance = containerInstance frontend
            }

            applicationRuntime = deploymentNode "Application Runtime" "Lokale oder serverseitige Spring-Boot-Laufzeitumgebung" "Java 21" {
                backendInstance = containerInstance backend
            }

            databaseRuntime = deploymentNode "Database Runtime" "Datenbankserver oder lokale Testdatenbank" "PostgreSQL / H2" {
                databaseInstance = containerInstance database
            }

            externalRuntime = deploymentNode "Externes System" "Autobahn API" "HTTP Service" {
                autobahnApiInstance = softwareSystemInstance autobahnApi
            }
        }
    }

    views {
        systemContext sqs "SystemContext" {
            include *
            autolayout lr
            title "Systemkontextdiagramm - SQS Verkehrsapp"
            description "Zeigt die SQS Verkehrsapp im Umfeld von Benutzer, externer Autobahn API, Datenbank und Qualitätsdiensten."
        }

        container sqs "Container" {
            include user
            include frontend
            include backend
            include database
            include autobahnApi
            include githubActions
            include teamscale
            include sonarCloud
            autolayout lr
            title "Containerdiagramm - SQS Verkehrsapp"
            description "Zeigt die deploybaren Hauptbestandteile der Anwendung."
        }

        component backend "BackendComponents" {
            include *
            autolayout lr
            title "Komponentendiagramm - Spring Boot Backend"
            description "Zeigt die interne Struktur des Backends nach Hexagonaler Architektur."
        }

        deployment sqs "Development" "Deployment" {
            include *
            autolayout lr
            title "Deployment Diagram - SQS Verkehrsapp"
            description "Zeigt, auf welchen Laufzeitumgebungen die Container betrieben werden."
        }

        styles {
            element "Person" {
                shape person
                background "#08427b"
                color "#ffffff"
            }

            element "Software System" {
                background "#1168bd"
                color "#ffffff"
            }

            element "Container" {
                background "#438dd5"
                color "#ffffff"
            }

            element "Component" {
                background "#85bbf0"
                color "#000000"
            }

            element "Database" {
                shape cylinder
                background "#438dd5"
                color "#ffffff"
            }

            element "External" {
                background "#999999"
                color "#ffffff"
            }
        }
    }
}
