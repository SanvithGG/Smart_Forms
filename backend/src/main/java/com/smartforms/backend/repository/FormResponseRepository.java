package com.smartforms.backend.repository;

import com.smartforms.backend.entity.FormResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormResponseRepository extends JpaRepository<FormResponse, String> {
    List<FormResponse> findByFormId(String formId);
}
