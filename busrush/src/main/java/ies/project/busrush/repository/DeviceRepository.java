package ies.project.busrush.repository;

import ies.project.busrush.model.Device;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
}