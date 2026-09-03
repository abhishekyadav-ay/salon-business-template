package salon_backend.service;

import java.util.List;

import salon_backend.entity.Branch;
import salon_backend.repository.BranchRepository;

@org.springframework.stereotype.Service
public class BranchService {

    private final BranchRepository branchRepository;

    public BranchService(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public Branch getBranchById(Long id) {
        return branchRepository.findById(id).orElse(null);
    }

    public Branch createBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    public Branch updateBranch(Long id, Branch branch) {

        Branch existingBranch =
                branchRepository.findById(id).orElse(null);

        if (existingBranch == null) {
            return null;
        }

        existingBranch.setName(branch.getName());
        existingBranch.setAddress(branch.getAddress());
        existingBranch.setPhone(branch.getPhone());
        existingBranch.setOpeningTime(branch.getOpeningTime());
        existingBranch.setClosingTime(branch.getClosingTime());
        existingBranch.setActive(branch.isActive());

        return branchRepository.save(existingBranch);
    }

    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }
}