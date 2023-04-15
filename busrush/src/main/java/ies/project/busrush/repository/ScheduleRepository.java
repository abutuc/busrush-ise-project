package ies.project.busrush.repository;

import ies.project.busrush.model.RouteId;
import ies.project.busrush.model.Schedule;
import ies.project.busrush.model.ScheduleId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, String> {
    @Query("SELECT s FROM Schedule s WHERE s.id = :scheduleId")
    Optional<Schedule> findByScheduleId(ScheduleId scheduleId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Schedule s WHERE s.id = :scheduleId")
    void deleteByScheduleId(ScheduleId scheduleId);

    @Query("SELECT s " +
            "FROM Schedule s " +
            "WHERE s.id.routeId = :routeId " +
            "ORDER BY s.id.sequence")
    List<Schedule> findAllByRouteId(RouteId routeId);

    @Query("SELECT s " +
            "FROM Schedule s " +
            "WHERE s.stop.id = :stopId " +
            "ORDER BY s.time ASC")
    List<Schedule> findAllByStopId(String stopId);

    @Query("SELECT s1 " +
            "FROM Schedule s1 " +
            "INNER JOIN Schedule s2 ON s1.route.id = s2.route.id " +
            "WHERE s1.stop.id = :originStopId AND s2.stop.id = :destinationStopId AND s1.id.sequence < s2.id.sequence " +
            "ORDER BY s1.time ASC")
    List<Schedule> findAllByOriginStopIdAndDestinationStopId(String originStopId, String destinationStopId);
}
