package de.th_ro.sqs_verkehrsapp.architecture;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import de.th_ro.sqs_verkehrsapp.SqsVerkehrsappApplication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(
        packagesOf = SqsVerkehrsappApplication.class,
        importOptions = ImportOption.DoNotIncludeTests.class
)
class ArchitectureTest {

    @ArchTest
    static final ArchRule CONTROLLERS_SHOULD_BE_IN_WEB_ADAPTER_PACKAGE =
            classes()
                    .that().areAnnotatedWith(RestController.class)
                    .should().resideInAPackage("..adapter.in.web..");

    @ArchTest
    static final ArchRule DTO_CLASSES_OF_WEB_ADAPTER_SHOULD_BE_IN_DTO_PACKAGE =
            classes()
                    .that().haveSimpleNameEndingWith("Dto")
                    .and().resideInAPackage("..adapter.in.web..")
                    .should().resideInAPackage("..adapter.in.web.dto..");

    @ArchTest
    static final ArchRule SERVICES_SHOULD_BE_IN_APPLICATION_SERVICE_PACKAGE =
            classes()
                    .that().areAnnotatedWith(Service.class)
                    .should().resideInAPackage("..application.service..");

    @ArchTest
    static final ArchRule APPLICATION_PORTS_SHOULD_BE_INTERFACES =
            classes()
                    .that().resideInAPackage("..application.port..")
                    .should().beInterfaces();

    @ArchTest
    static final ArchRule INCOMING_PORTS_SHOULD_ONLY_BE_IN_APPLICATION_PORT_IN_PACKAGE =
            classes()
                    .that().haveSimpleNameEndingWith("UseCase")
                    .should().resideInAPackage("..application.port.in..")
                    .andShould().beInterfaces();

    @ArchTest
    static final ArchRule OUTGOING_PORTS_SHOULD_ONLY_BE_IN_APPLICATION_PORT_OUT_PACKAGE =
            classes()
                    .that().haveSimpleNameEndingWith("Port")
                    .should().resideInAPackage("..application.port.out..")
                    .andShould().beInterfaces();

    @ArchTest
    static final ArchRule DOMAIN_SHOULD_NOT_DEPEND_ON_SPRING =
            noClasses()
                    .that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("org.springframework..");

    @ArchTest
    static final ArchRule DOMAIN_SHOULD_NOT_DEPEND_ON_APPLICATION =
            noClasses()
                    .that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..application..");

    @ArchTest
    static final ArchRule DOMAIN_SHOULD_NOT_DEPEND_ON_ADAPTERS =
            noClasses()
                    .that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..adapter..");

    @ArchTest
    static final ArchRule APPLICATION_SHOULD_NOT_DEPEND_ON_ADAPTERS =
            noClasses()
                    .that().resideInAPackage("..application..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..adapter..");

    @ArchTest
    static final ArchRule INCOMING_ADAPTERS_SHOULD_NOT_DEPEND_ON_OUTGOING_ADAPTERS =
            noClasses()
                    .that().resideInAPackage("..adapter.in..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..adapter.out..");

    @ArchTest
    static final ArchRule OUTGOING_ADAPTERS_SHOULD_NOT_DEPEND_ON_INCOMING_ADAPTERS =
            noClasses()
                    .that().resideInAPackage("..adapter.out..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..adapter.in..");

    @ArchTest
    static final ArchRule WEB_ADAPTER_SHOULD_ONLY_ACCESS_INCOMING_PORTS =
            noClasses()
                    .that().resideInAPackage("..adapter.in.web..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..application.port.out..");

    @ArchTest
    static final ArchRule OUTGOING_ADAPTERS_SHOULD_ONLY_ACCESS_OUTGOING_PORTS =
            noClasses()
                    .that().resideInAPackage("..adapter.out..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..application.port.in..");

    @ArchTest
    static final ArchRule CONFIG_MAY_WIRE_ADAPTERS_BUT_DOMAIN_MUST_STAY_CLEAN =
            noClasses()
                    .that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat()
                    .resideInAnyPackage("..config..");

    @ArchTest
    static final ArchRule PERSISTENCE_ENTITIES_SHOULD_STAY_IN_PERSISTENCE_ADAPTER =
            classes()
                    .that().haveSimpleNameEndingWith("Entity")
                    .should().resideInAPackage("..adapter.out..persistence..");

    @ArchTest
    static final ArchRule REPOSITORIES_SHOULD_STAY_IN_PERSISTENCE_ADAPTER =
            classes()
                    .that().haveSimpleNameEndingWith("Repository")
                    .should().resideInAPackage("..adapter.out..persistence..");

    @ArchTest
    static final ArchRule API_CLIENTS_AND_MAPPERS_SHOULD_STAY_IN_AUTOBAHN_ADAPTER =
            classes()
                    .that().haveNameMatching(".*(ApiClient|ApiMapper)")
                    .should().resideInAPackage("..adapter.out.autobahn..");
}