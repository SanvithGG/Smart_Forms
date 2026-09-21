package com.smartforms.backend.service;

import com.smartforms.backend.dto.BranchDtos.*;
import com.smartforms.backend.entity.Branch;
import com.smartforms.backend.exception.ApiException;
import com.smartforms.backend.repository.BranchRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class BranchService {

    private final BranchRepository branchRepository;

    public BranchService(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    public Branch create(CreateBranchRequest req) {
        Branch b = new Branch();
        b.setFormId(req.formId());
        b.setSourceQuestionId(req.sourceQuestionId());
        b.setTargetQuestionId(req.targetQuestionId());
        b.setConditionJson(req.conditionJson());
        b.setPriority(Objects.requireNonNullElse(req.priority(), 0));
        return branchRepository.save(b);
    }

    public List<Branch> listForForm(String formId) {
        return branchRepository.findByFormId(formId);
    }

    public Branch get(String id) {
        return branchRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Branch not found"));
    }

    public void delete(String id) {
        branchRepository.deleteById(Objects.requireNonNull(id));
    }
}
