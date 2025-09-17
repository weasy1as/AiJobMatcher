package com.weasy.aijobmatch;

import com.weasy.aijobmatch.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByUserId(UUID userId);
}
