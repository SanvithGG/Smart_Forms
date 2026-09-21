package com.smartforms.backend.controller;

import com.smartforms.backend.dto.BranchDtos.*;
import com.smartforms.backend.entity.Branch;
import com.smartforms.backend.service.BranchService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @PostMapping
    public Branch create(@Valid @RequestBody CreateBranchRequest req) {
        return branchService.create(req);
    }

    @GetMapping
    public List<Branch> listForForm(@RequestParam String formId) {
        return branchService.listForForm(formId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        branchService.delete(id);
    }
}
