package ies.project.busrush.dto.crud;

import ies.project.busrush.dto.id.ScheduleIdDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StopCrudDto {
    private String id;
    private String designation;
    private Double[] position;
    private ScheduleIdDto[] schedulesId;
}
