package micro.mentalhealth.project.service;

import micro.mentalhealth.project.dto.AuthRequestDTO;
import micro.mentalhealth.project.dto.AuthResponseDTO;
import micro.mentalhealth.project.dto.RegisterRequestDTO;
import micro.mentalhealth.project.model.*;
import micro.mentalhealth.project.repository.UserRepository;
import micro.mentalhealth.project.util.JwtUtil;
import micro.mentalhealth.project.mapper.UserMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword())); // encode password after mapping

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(
                savedUser.getEmail().getValue(),
                savedUser.getRole().name(),
                savedUser.getId().toString()
        );

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setUser(userMapper.toDTO(savedUser));

        return response;
    }

    public AuthResponseDTO authenticate(AuthRequestDTO request) {
        Optional<User> optionalUser = userRepository.findByEmail(new Email(request.getEmail())); // <-- conversion ici
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail().getValue(),
                user.getRole().name(),
                user.getId().toString()
        );
        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setUser(userMapper.toDTO(user));

        return response;
    }
}
