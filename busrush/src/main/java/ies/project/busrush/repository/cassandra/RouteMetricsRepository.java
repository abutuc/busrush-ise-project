package ies.project.busrush.repository.cassandra;

import ies.project.busrush.model.cassandra.RouteMetrics;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface RouteMetricsRepository extends CassandraRepository<RouteMetrics, String> {
}
