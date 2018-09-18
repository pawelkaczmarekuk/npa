package uk.gov.hmcts.reform.em.npa.cucumber.stepdefs;

import uk.gov.hmcts.reform.em.npa.NpaApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = NpaApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
