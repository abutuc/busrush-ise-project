package ies.project.busrush.dto.stats;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DayDelayDto {
    private LocalDate date;
    private Integer delayed;
    @JsonProperty("on_time")
    private Integer onTime;
}
