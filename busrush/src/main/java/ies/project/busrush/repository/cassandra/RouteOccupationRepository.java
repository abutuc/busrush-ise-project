package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.RouteOccupation;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.List;

public interface RouteOccupationRepository extends CassandraRepository<RouteOccupation, String> {

    @Query("SELECT route_id, route_shift, (AVG(CAST(passengers AS float))/90)*100 as occupation " +
            "FROM route_metrics " +
            "WHERE timestamp >= ?0 AND timestamp < ?1 " +
            "GROUP BY route_id, route_shift " +
            "ALLOW FILTERING")
    List<RouteOccupation> findAllOccupations(Long from, Long to);
}
