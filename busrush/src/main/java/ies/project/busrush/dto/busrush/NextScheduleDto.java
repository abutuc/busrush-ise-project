package ies.project.busrush.dto.busrush;

import ies.project.busrush.dto.basic.RouteBasicDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor

public class NextScheduleDto {
    private String id;
    private RouteBasicDto route;
    private LocalTime time;
    private Double delay;
}
