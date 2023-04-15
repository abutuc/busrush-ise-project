package ies.project.busrush.model.cassandra;

import java.util.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.cassandra.core.mapping.CassandraType; 
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;

// {'device_id': 'AVRBUS-D0001', 'route_id': 'AVRBUS-L04', 'route_shift': '083000', 'timestamp': 1670868915, 'position': [40.63554147, -8.65516931], 'speed': 15.156, 'fuel': 98.878, 'passengers': 15}


@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("bus_metrics")
public class BusMetrics {
    @PrimaryKeyColumn(name = "bus_id", ordinal = 0, type = PrimaryKeyType.PARTITIONED)    
    private String bus_id;
    @PrimaryKeyColumn(name = "timestamp", ordinal = 1, type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
    private Long timestamp;
    private String route_id;
    private String route_shift;
    private String device_id;
    @CassandraType(type = CassandraType.Name.LIST, typeArguments = CassandraType.Name.DOUBLE)
    private List<Double> position;
    private Double speed;
    private Double fuel;
    private int passengers;
    private Double delay;
}
