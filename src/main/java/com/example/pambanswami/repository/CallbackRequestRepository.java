
package com.example.pambanswami.repository;

import com.example.pambanswami.entity.CallbackRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CallbackRequestRepository
                extends JpaRepository<CallbackRequest, Long> {
}