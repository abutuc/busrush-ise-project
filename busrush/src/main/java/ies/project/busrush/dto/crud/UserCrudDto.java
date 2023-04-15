package ies.project.busrush.dto.crud;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserCrudDto {
    private String username;
    private String password;
}
