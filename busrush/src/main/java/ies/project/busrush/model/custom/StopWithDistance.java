package ies.project.busrush.model.custom;

import ies.project.busrush.model.Stop;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StopWithDistance {
    private Stop stop;
    private Double distance;
}
