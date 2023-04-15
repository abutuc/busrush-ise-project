package ies.project.busrush.repository;

import ies.project.busrush.model.Driver;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
}
