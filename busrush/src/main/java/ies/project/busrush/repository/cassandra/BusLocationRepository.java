package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.CurrentLocation;
import ies.project.busrush.model.cassandra.RouteMetrics;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.List;

public interface BusLocationRepository extends CassandraRepository<CurrentLocation, String> {

    @Query("SELECT position " +
            "FROM route_metrics " +
            "WHERE bus_id = ?0 AND route_id = ?1 AND route_shift = ?2 " +
            "LIMIT 1 " +
            "ALLOW FILTERING")
    List<CurrentLocation> findPositionByBusId(String bus_id, String route_id, String route_shift);
}
