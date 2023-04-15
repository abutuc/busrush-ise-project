package ies.project.busrush.repository;

import ies.project.busrush.model.Bus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface BusRepository extends JpaRepository<Bus, String> {
    @Query("SELECT b.id FROM Bus b WHERE b.device.id = ?1")
    String findIdByDeviceId(String deviceId);
}
