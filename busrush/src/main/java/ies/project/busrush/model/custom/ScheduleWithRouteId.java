package ies.project.busrush.model.custom;

import ies.project.busrush.model.Schedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleWithRouteId {
    private String routeId;
    private Schedule schedule;
}
