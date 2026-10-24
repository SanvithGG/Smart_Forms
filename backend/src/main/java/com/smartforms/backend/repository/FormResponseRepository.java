package com.smartforms.backend.repository;

import com.smartforms.backend.entity.FormResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FormResponseRepository extends JpaRepository<FormResponse, String> {
    List<FormResponse> findByFormId(String formId);

    @Modifying
    @Query("DELETE FROM FormResponse r WHERE r.formId = :formId")
    void deleteByFormId(@Param("formId") String formId);
}
