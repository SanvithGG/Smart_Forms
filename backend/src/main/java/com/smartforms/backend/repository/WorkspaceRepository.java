package com.smartforms.backend.repository;

import com.smartforms.backend.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, String> {
    List<Workspace> findByOwnerId(String ownerId);
}
