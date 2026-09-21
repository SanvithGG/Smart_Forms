package com.smartforms.backend.repository;

import com.smartforms.backend.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, String> {
    List<Branch> findByFormId(String formId);
    List<Branch> findBySourceQuestionIdOrderByPriorityAsc(String sourceQuestionId);
    void deleteByFormId(String formId);
}
