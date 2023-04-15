package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.BusMetrics;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.List;

public interface BusMetricsRepository extends CassandraRepository<BusMetrics, String> {

    @Query("SELECT bus_id " +
            "FROM bus_metrics " +
            "WHERE delay > 300 AND timestamp >= ?0 AND timestamp < ?1 " +
            "GROUP BY bus_id " +
            "ALLOW FILTERING")
    List<BusMetrics> findAllDelayed(Long from, Long to);
}
