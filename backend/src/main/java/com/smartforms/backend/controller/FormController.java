package com.smartforms.backend.controller;

import com.smartforms.backend.dto.FormDtos.*;
import com.smartforms.backend.service.FormService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
public class FormController {

    private final FormService formService;

    public FormController(FormService formService) {
        this.formService = formService;
    }

    @PostMapping
    public FormResponseDto create(@Valid @RequestBody CreateFormRequest req) {
        return formService.toFormDto(formService.create(req));
    }

    @GetMapping
    public List<FormResponseDto> listForWorkspace(@RequestParam String workspaceId) {
        return formService.listForWorkspace(workspaceId).stream().map(formService::toFormDto).toList();
    }

    @GetMapping("/{id}")
    public FormResponseDto get(@PathVariable String id) {
        return formService.toFormDto(formService.get(id));
    }

    /** Returns the form plus its full question graph and branches - what the canvas editor loads. */
    @GetMapping("/{id}/graph")
    public FormWithGraphDto getGraph(@PathVariable String id) {
        return formService.getWithGraph(id);
    }

    @PutMapping("/{id}")
    public FormResponseDto update(@PathVariable String id, @RequestBody UpdateFormRequest req) {
        return formService.toFormDto(formService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        formService.delete(id);
    }
}
