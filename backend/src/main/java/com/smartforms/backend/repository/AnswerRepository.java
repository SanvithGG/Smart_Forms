package com.smartforms.backend.repository;

import com.smartforms.backend.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, String> {
    List<Answer> findByResponseId(String responseId);
}
