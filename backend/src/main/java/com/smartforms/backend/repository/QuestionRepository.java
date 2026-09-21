package com.smartforms.backend.repository;

import com.smartforms.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByFormIdOrderByOrderIndexAsc(String formId);
    void deleteByFormId(String formId);
}
