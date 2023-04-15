package ies.project.busrush.dto.stats;

import ies.project.busrush.dto.basic.RouteBasicDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;


@Data
@AllArgsConstructor
public class DayOccupationDto {
    private LocalDate date;
    private RouteBasicDto route;
    private Double occupation;
}
