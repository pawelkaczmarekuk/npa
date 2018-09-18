package uk.gov.hmcts.reform.em.npa.repository;

import uk.gov.hmcts.reform.em.npa.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
