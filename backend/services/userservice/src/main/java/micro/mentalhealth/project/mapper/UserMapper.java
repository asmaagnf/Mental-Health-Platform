package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.RegisterRequestDTO;
import micro.mentalhealth.project.dto.UserDTO;
import micro.mentalhealth.project.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail() != null ? user.getEmail().getValue() : null);
        dto.setPhoneNumber(user.getPhoneNumber() != null ? user.getPhoneNumber().getValue() : null);
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setAddress(user.getAddress() != null ? user.getAddress().toString() : null); // override toString() in Address VO to format nicely
        dto.setGender(user.getGender() != null ? user.getGender().name() : null);
        dto.setRole(user.getRole() != null ? user.getRole().name() : null);
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    public List<UserDTO> toDTOList(List<User> users) {
        return users.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public User toEntity(RegisterRequestDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail() != null ? new Email(dto.getEmail()) : null);
        user.setPassword(dto.getPassword()); // Note: encoding password should stay in service layer
        user.setPhoneNumber(dto.getPhoneNumber() != null ? new PhoneNumber(dto.getPhoneNumber()) : null);
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setAddress(dto.getAddress() != null ? Address.fromString(dto.getAddress()) : null);
        user.setGender(dto.getGender() != null ? Gender.valueOf(dto.getGender().toUpperCase()) : null);
        user.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole().toUpperCase()) : null);
        user.setProfilePictureUrl(dto.getProfilePictureUrl());
        return user;
    }
}
