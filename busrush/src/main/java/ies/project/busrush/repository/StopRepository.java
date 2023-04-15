package ies.project.busrush.repository;

import ies.project.busrush.model.ScheduleId;
import ies.project.busrush.model.Stop;
import ies.project.busrush.model.custom.StopWithDistance;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface StopRepository extends JpaRepository<Stop, String> {

    @Query("SELECT stop " +
            "FROM Stop stop " +
            "INNER JOIN Schedule sche ON stop.id = sche.stop.id " +
            "WHERE sche.id = :scheduleId " +
            "ORDER BY sche.id.sequence ASC")
    List<Stop> findAllByScheduleId(ScheduleId scheduleId);

    @Query("SELECT new ies.project.busrush.model.custom.StopWithDistance(" +
            "   s, " +
            "   6371000 * acos(cos(radians(:lat)) * cos(radians(s.lat)) * cos(radians(s.lon) - radians(:lon)) + sin(radians(:lat)) * sin(radians(s.lat)))" +
            ") " +
            "FROM Stop s " +
            "ORDER BY (" +
            "   6371000 * " +
            "   acos(cos(radians(:lat)) * cos(radians(s.lat)) * cos(radians(s.lon) - radians(:lon)) + sin(radians(:lat)) * sin(radians(s.lat)))" +
            ") ASC")
    List<StopWithDistance> findClosest(Double lat, Double lon, Pageable pageable);
}
