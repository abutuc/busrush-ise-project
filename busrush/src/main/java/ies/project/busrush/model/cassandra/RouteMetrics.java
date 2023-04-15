package ies.project.busrush.model.cassandra;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("route_metrics")
public class RouteMetrics {
    @PrimaryKeyColumn(name = "route_id", ordinal = 0, type = PrimaryKeyType.PARTITIONED)
    private String route_id;
    @PrimaryKeyColumn(name = "route_shift", ordinal = 1, type = PrimaryKeyType.PARTITIONED)
    private String route_shift;
    @PrimaryKeyColumn(name = "timestamp", ordinal = 2, type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
    private Long timestamp;
    private String bus_id;
    private String device_id;
    @CassandraType(type = CassandraType.Name.LIST, typeArguments = CassandraType.Name.DOUBLE)
    private List<Double> position;
    private Double speed;
    private Double fuel;
    private int passengers;
    private Double delay;
}