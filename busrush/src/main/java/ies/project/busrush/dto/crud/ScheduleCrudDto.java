package ies.project.busrush.dto.crud;

import ies.project.busrush.dto.id.ScheduleIdDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ScheduleCrudDto {
    private ScheduleIdDto id;
    private LocalTime time;
}
