package ies.project.busrush.dto.osrm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableServiceDto {
    List<List<Double>> durations;
}
