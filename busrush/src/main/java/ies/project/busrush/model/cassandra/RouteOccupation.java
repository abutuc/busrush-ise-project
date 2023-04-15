package ies.project.busrush.model.cassandra;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteOccupation {
    private String route_id;
    private String route_shift;
    private Double occupation;
}
