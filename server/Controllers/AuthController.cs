using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;
using System.Security.Claims;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // ✅ Register endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.FullName) ||
                    string.IsNullOrWhiteSpace(request.Email) ||
                    string.IsNullOrWhiteSpace(request.Password) ||
                    string.IsNullOrWhiteSpace(request.Role))
                {
                    return BadRequest(new { Error = "All fields (fullName, email, password, role) are required" });
                }

                var user = await _authService.Register(request.FullName, request.Email, request.Password, request.Role);

                return Ok(new { Message = "User registered successfully", UserId = user.UserId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // ✅ Login endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { Error = "Email and password are required" });
                }

                var token = await _authService.Login(request.Email, request.Password);

                // Set JWT in HttpOnly cookie
                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false, // Set to true in production (HTTPS)
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(1)
                });

                return Ok(new { Message = "Login successful" });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
        }


        [HttpPost("select-affiliation")]
        [Authorize]
        public async Task<IActionResult> SelectAffiliation([FromBody] SelectAffiliationRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { Error = "User ID not found in token" });
                }

                await _authService.UpdateUserAffiliation(userId, request);
                return Ok(new { Message = "Affiliation updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // ✅ Seed data (for testing)
        [HttpPost("seed")]
        public async Task<IActionResult> SeedData()
        {
            try
            {
                await _authService.SeedData();
                return Ok(new { Message = "Data seeded successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // ✅ Get all users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _authService.GetUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // ✅ Delete user (only authorized)
        [HttpDelete("users/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _authService.DeleteUser(id);
                return Ok(new { Message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return NotFound(new { Error = ex.Message });
            }
        }
    }
}
