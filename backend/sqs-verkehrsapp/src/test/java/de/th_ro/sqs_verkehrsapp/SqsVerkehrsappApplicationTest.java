package de.th_ro.sqs_verkehrsapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@ActiveProfiles("test")
class SqsVerkehrsappApplicationTest {

	@Test
	void contextLoads() {
	}

}
