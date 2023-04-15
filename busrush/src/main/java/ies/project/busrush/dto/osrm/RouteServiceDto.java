package ies.project.busrush.dto.osrm;

import ies.project.busrush.dto.osrm.route.RouteServiceRouteDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteServiceDto {
    List<RouteServiceRouteDto> routes;
}
