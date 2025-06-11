package micro.mentalhealth.project.service;

import micro.mentalhealth.project.dto.UserDTO;
import micro.mentalhealth.project.mapper.UserMapper;
import micro.mentalhealth.project.model.Email;
import micro.mentalhealth.project.model.PhoneNumber;
import micro.mentalhealth.project.model.Address;
import micro.mentalhealth.project.model.User;
import micro.mentalhealth.project.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.io.File;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserDTO getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(new Email(email))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toDTO(user);
    }

    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id " + id));
        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO updateUserById(UUID id, UserDTO updatedDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id " + id));

        user.setName(updatedDto.getName());
        user.setPhoneNumber(new PhoneNumber(updatedDto.getPhoneNumber()));
        user.setAddress(Address.fromString(updatedDto.getAddress()));
        user.setProfilePictureUrl(updatedDto.getProfilePictureUrl());

        return userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id " + id));
        userRepository.delete(user);
    }

    public String saveProfilePicture(UUID id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id " + id));

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.matches(".*\\.(png|jpg|jpeg)$")) {
            throw new IllegalArgumentException("Only PNG, JPG, or JPEG files are allowed");
        }

        // Absolute folder path on your disk
        String folderPath = "C:/Users/HP/Desktop/mental-health-platform/backend/services/userservice/uploads/";

        // Create folder if it does not exist
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        // Remove old picture if exists
        if (user.getProfilePictureUrl() != null) {
            String oldFileName = user.getProfilePictureUrl().replace("/uploads/", "");
            Path oldFilePath = Paths.get(folderPath, oldFileName);
            try {
                Files.deleteIfExists(oldFilePath);
            } catch (IOException e) {
                System.err.println("Failed to delete old profile picture: " + e.getMessage());
            }
        }

        // Save new file
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String filename = "user_" + id + extension;
        Path filePath = Paths.get(folderPath, filename);

        try {
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file", e);
        }

        // Save URL as a relative path from your server's root URL mapping
        String imageUrl = "/uploads/" + filename;
        user.setProfilePictureUrl(imageUrl);
        userRepository.save(user);

        return imageUrl;
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }
}
