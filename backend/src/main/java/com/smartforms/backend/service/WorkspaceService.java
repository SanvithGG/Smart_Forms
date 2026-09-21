package com.smartforms.backend.service;

import com.smartforms.backend.entity.Workspace;
import com.smartforms.backend.exception.ApiException;
import com.smartforms.backend.repository.WorkspaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public Workspace create(String ownerId, String name) {
        Workspace ws = new Workspace();
        ws.setOwnerId(ownerId);
        ws.setName(name);
        return workspaceRepository.save(Objects.requireNonNull(ws));
    }

    public List<Workspace> listForOwner(String ownerId) {
        return workspaceRepository.findByOwnerId(ownerId);
    }

    public Workspace getOwned(String id, String ownerId) {
        Workspace ws = workspaceRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Workspace not found"));
        if (!ws.getOwnerId().equals(ownerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have access to this workspace");
        }
        return ws;
    }
}
