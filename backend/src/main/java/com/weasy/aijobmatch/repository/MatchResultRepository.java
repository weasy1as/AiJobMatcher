package com.weasy.aijobmatch;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MatchResultRepository extends JpaRepository<MatchResult, UUID> {
    List<MatchResult> findByResumeId(UUID resumeId);
    List<MatchResult> findByJobId(UUID jobId);
}
