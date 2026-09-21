package com.smartforms.backend.controller;

import com.smartforms.backend.entity.Workspace;
import com.smartforms.backend.service.WorkspaceService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @PostMapping
    public Workspace create(@AuthenticationPrincipal String userId, @RequestBody Map<String, String> body) {
        return workspaceService.create(userId, body.get("name"));
    }

    @GetMapping
    public List<Workspace> list(@AuthenticationPrincipal String userId) {
        return workspaceService.listForOwner(userId);
    }

    @GetMapping("/{id}")
    public Workspace get(@AuthenticationPrincipal String userId, @PathVariable String id) {
        return workspaceService.getOwned(id, userId);
    }
}
