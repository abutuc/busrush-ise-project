package ies.project.busrush.dto.busrush;

import com.fasterxml.jackson.annotation.JsonProperty;
import ies.project.busrush.dto.basic.BusBasicDto;
import ies.project.busrush.dto.basic.StopBasicDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class InfoScheduleDto {
    private String id;
    private BusBasicDto bus;
    private Integer passengers;
    @JsonProperty("next_stop")
    private StopBasicDto nextStop;
    private LocalTime time;
    private Double delay;
}
