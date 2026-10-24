package com.smartforms.backend.repository;

import com.smartforms.backend.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, String> {
    List<Answer> findByResponseId(String responseId);
    void deleteByResponseId(String responseId);

    @Modifying
    @Query("DELETE FROM Answer a WHERE a.responseId IN :responseIds")
    void deleteByResponseIdIn(@Param("responseIds") Collection<String> responseIds);

    @Modifying
    @Query("DELETE FROM Answer a WHERE a.questionId IN (SELECT q.id FROM Question q WHERE q.formId = :formId) OR a.responseId IN (SELECT r.id FROM FormResponse r WHERE r.formId = :formId)")
    void deleteByFormId(@Param("formId") String formId);
}

