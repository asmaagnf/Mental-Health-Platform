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
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
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
        user.setDateOfBirth(updatedDto.getDateOfBirth());
        return userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id " + id));
        userRepository.delete(user);
    }

    public String saveProfilePicture(UUID id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id " + id));

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Configure upload directory (use system property or environment variable)
        String uploadDir = System.getProperty("user.uploads.dir",
                "C:/Users/HP/Desktop/mental-health-platform/backend/services/userservice/uploads/");

        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Delete old picture if exists
        if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isEmpty()) {
            try {
                String oldFileName = user.getProfilePictureUrl().substring(user.getProfilePictureUrl().lastIndexOf('/') + 1);
                Path oldFilePath = uploadPath.resolve(oldFileName);
                Files.deleteIfExists(oldFilePath);
            } catch (IOException e) {
                throw new RuntimeException("Unable to delete old profile picture", e);
            }
        }

        // Generate unique filename
        String extension = Objects.requireNonNull(file.getOriginalFilename())
                .substring(file.getOriginalFilename().lastIndexOf('.'));
        String filename = "user_" + id + "_" + System.currentTimeMillis() + extension;
        Path filePath = uploadPath.resolve(filename);

        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Store relative URL
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
