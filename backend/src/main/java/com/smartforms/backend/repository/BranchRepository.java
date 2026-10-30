package com.smartforms.backend.repository;

import com.smartforms.backend.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, String> {
    List<Branch> findByFormId(String formId);
    List<Branch> findBySourceQuestionIdOrderByPriorityAsc(String sourceQuestionId);
    void deleteByFormId(String formId);

    @Modifying
    @Query("DELETE FROM Branch b WHERE b.sourceQuestionId = :questionId OR b.targetQuestionId = :questionId")
    void deleteByQuestionId(@Param("questionId") String questionId);
}
