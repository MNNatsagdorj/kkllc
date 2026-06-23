package com.kkllc.admin.security;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminUserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(AdminUserMapper userMapper, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public record LoginReq(@NotBlank String username, @NotBlank String password) {}
    public record RefreshReq(@NotBlank String refreshToken) {}
    public record TokenRes(String accessToken, String refreshToken, String username, String displayName, String role) {}

    @PostMapping("/login")
    public ApiResponse<TokenRes> login(@Valid @RequestBody LoginReq req) {
        AdminUser u = userMapper.findByUsername(req.username());
        if (u == null || !u.isActive() || !passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "Нэр эсвэл нууц үг буруу байна");
        }
        return ApiResponse.ok(new TokenRes(
                jwtService.issueAccess(u.getId(), u.getUsername(), u.getRole()),
                jwtService.issueRefresh(u.getId(), u.getUsername(), u.getRole()),
                u.getUsername(), u.getDisplayName(), u.getRole()));
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenRes> refresh(@Valid @RequestBody RefreshReq req) {
        try {
            var claims = jwtService.parse(req.refreshToken());
            if (!"refresh".equals(claims.get("type"))) {
                throw new BizException(ErrorCode.UNAUTHORIZED);
            }
            Long userId = Long.valueOf(claims.getSubject());
            String username = (String) claims.get("username");
            String role = (String) claims.get("role");
            return ApiResponse.ok(new TokenRes(
                    jwtService.issueAccess(userId, username, role),
                    jwtService.issueRefresh(userId, username, role),
                    username, null, role));
        } catch (BizException e) {
            throw e;
        } catch (Exception e) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "Refresh token буруу байна");
        }
    }
}
