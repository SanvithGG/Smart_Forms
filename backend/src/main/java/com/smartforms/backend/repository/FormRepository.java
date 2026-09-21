package com.smartforms.backend.repository;

import com.smartforms.backend.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormRepository extends JpaRepository<Form, String> {
    List<Form> findByWorkspaceId(String workspaceId);
}
