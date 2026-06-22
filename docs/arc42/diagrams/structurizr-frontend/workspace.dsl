workspace "SQS VerkehrsApp - Frontend" "C4 Komponentendiagramm des React-TypeScript-Frontends" {

    model {
        user = person "Benutzer" "Nutzt die Web-App im Browser"

        backendSystem = softwareSystem "Backend" "Spring Boot REST API" "External"

        frontend = softwareSystem "React + TypeScript Frontend" {

            webApp = container "Web-App" "React SPA" "React, TypeScript, Vite" {

                // Layout-Komponenten
                app       = component "App"       "Layout" "Root-Komponente. Koordiniert Header, Modals und Hauptinhalt"
                appHeader = component "AppHeader" "Layout" "Navigation und Login/Logout-Button"
                appMain   = component "AppMain"   "Layout" "Hauptinhalt: Selektor und Verkehrsansicht"
                appModals = component "AppModals" "Layout" "Auth-Modal und Logout-Bestätigung"
                pageHero  = component "PageHero"  "Layout" "Hero-Bereich mit Titel und Status"

                // Selektor-Komponenten
                autobahnSelector = component "AutobahnSelector" "Selektor" "Auswahl von Autobahnen per Chip"
                selectorCard     = component "SelectorCard"     "Selektor" "Einzelner auswählbarer Autobahn-Chip"

                // Traffic-Komponenten
                trafficView = component "TrafficView" "Traffic" "Anzeige von Verkehrsereignissen"
                incidentMap = component "IncidentMap" "Traffic" "Kartenansicht der Ereignisse"
                riskBadge   = component "RiskBadge"   "Traffic" "Farbige Risikostufen-Anzeige"

                // Dashboard-Komponenten
                dashboard        = component "Dashboard"        "Dashboard" "Übersicht gespeicherter Autobahnen"
                dashboardRoadCard = component "DashboardRoadCard" "Dashboard" "Einzelne Autobahn-Karte im Dashboard"

                // Modal-Komponenten
                authModal    = component "AuthModal"    "Modal" "Login- und Registrierungsformular"
                confirmModal = component "ConfirmModal" "Modal" "Logout-Bestätigungsdialog"

                // Custom Hooks
                useApp              = component "useApp"              "Hook" "Zentraler App-State-Koordinator"
                useAuth             = component "useAuth"             "Hook" "Authentifizierungszustand und -aktionen"
                useTraffic          = component "useTraffic"          "Hook" "Verkehrsdaten und Straßenauswahl"
                useAutobahnSelector = component "useAutobahnSelector" "Hook" "Verfügbare Autobahnen laden"
                useDashboard        = component "useDashboard"        "Hook" "Dashboard-Daten laden"

                // Service
                trafficService = component "trafficService" "Service" "Alle REST-API-Aufrufe zum Backend"

                // Utilities
                validateAuthForm  = component "validateAuthForm"  "Util" "Formularvalidierung für Login und Registrierung"
                formatCachedAt    = component "formatCachedAt"    "Util" "Formatierung des Cache-Zeitstempels"
                buildSavedMessage = component "buildSavedMessage" "Util" "Statusmeldung nach Favoriten-Speicherung"

                // Abhängigkeiten
                user -> app "verwendet"

                app -> appHeader "rendert"
                app -> appMain   "rendert"
                app -> appModals "rendert"
                app -> useApp    "verwendet"

                appMain -> autobahnSelector "rendert"
                appMain -> trafficView      "rendert"
                appMain -> dashboard        "rendert"
                appMain -> pageHero         "rendert"

                appModals -> authModal    "rendert"
                appModals -> confirmModal "rendert"

                autobahnSelector -> useAutobahnSelector "verwendet"
                autobahnSelector -> selectorCard        "rendert"

                trafficView -> riskBadge   "rendert"
                trafficView -> incidentMap "rendert"

                dashboard -> dashboardRoadCard "rendert"
                dashboard -> useDashboard      "verwendet"

                authModal -> validateAuthForm "verwendet"

                useApp -> useAuth             "koordiniert"
                useApp -> useTraffic          "koordiniert"
                useApp -> validateAuthForm    "verwendet"
                useApp -> buildSavedMessage   "verwendet"
                useApp -> trafficService      "ruft auf"

                useAuth             -> trafficService "ruft auf"
                useTraffic          -> trafficService "ruft auf"
                useAutobahnSelector -> trafficService "ruft auf"
                useDashboard        -> trafficService "ruft auf"

                trafficService -> backendSystem "HTTP REST" "JSON/HTTPS"
            }
        }
    }

    views {
        component webApp "FrontendComponents" "C4 Komponentendiagramm - Frontend" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape Person
                background #08427B
                color #ffffff
            }
            element "Layout" {
                background #85BBF0
                color #000000
            }
            element "Selektor" {
                background #85BBF0
                color #000000
            }
            element "Traffic" {
                background #85BBF0
                color #000000
            }
            element "Dashboard" {
                background #85BBF0
                color #000000
            }
            element "Modal" {
                background #85BBF0
                color #000000
            }
            element "Hook" {
                background #1168BD
                color #ffffff
            }
            element "Service" {
                background #2E8648
                color #ffffff
            }
            element "Util" {
                background #E8E8E8
                color #000000
            }
            element "External" {
                background #999999
                color #ffffff
            }
        }

        theme default
    }
}
