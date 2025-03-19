using Microsoft.AspNetCore.Mvc;
using Server.Services; // Ensure this is included

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService; // Use concrete AuthService, not IAuthService

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _authService.Register(request.FullName, request.Email, request.Password, request.Role);
                return Ok(new { Message = "User registered successfully", UserId = user.UserId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _authService.Login(request.Email, request.Password);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
        }
    }

    public record RegisterRequest(string FullName, string Email, string Password, string Role);
    public record LoginRequest(string Email, string Password);
}