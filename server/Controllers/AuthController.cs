using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;
using System.Security.Claims;
using Server.DTOs;


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

                var data = await _authService.Register(request.FullName, request.Email, request.Password, request.Role);

                Response.Cookies.Append("jwt", data.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Enable in production
                    SameSite = SameSiteMode.Lax, // More permissive for mobile browsers
                    Expires = DateTime.UtcNow.AddDays(1),
                    Path = "/" // Ensure cookie is available across all paths
                });

                var user = new UserData(UserId: data.user.UserId, FullName: data.user.FullName, Role: data.user.Role);

                return Ok(new { Message = "User registered successfully", user });
                // return Ok(new { Message = "User registered successfully", UserId = user.UserId });
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

                var data = await _authService.Login(request.Email, request.Password);

                // Set JWT in HttpOnly cookie
                Response.Cookies.Append("jwt", data.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Enable in production
                    SameSite = SameSiteMode.Lax, // More permissive for mobile browsers
                    Expires = DateTime.UtcNow.AddDays(1),
                    Path = "/" // Ensure cookie is available across all paths
                });
                var user = new UserData(UserId: data.user.UserId, FullName: data.user.FullName, Role: data.user.Role);

                return Ok(new { Message = "Login successful", user });
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

                var data = await _authService.UpdateUserAffiliation(userId, request);
                var user = new UserData(UserId: data.user.UserId, FullName: data.user.FullName, Role: data.user.Role);
                return Ok(new { Message = "Affiliation updated successfully", user });
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

        [HttpGet("colleges")]

        public async Task<IActionResult> GetColleges()
        {

            try
            {
                var colleges = await _authService.GetColleges();
                return Ok(colleges);
            }
            catch (Exception ex)
            {
                return NotFound(new { Error = ex.Message });
            }


        }


        [HttpGet("faculties")]

        public async Task<IActionResult> GetFaculties([FromQuery] int collegeId)
        {
            var faculties = await _authService.GetFaculties(collegeId);
            return Ok(faculties);
        }


        [HttpGet("courses")]

        public async Task<IActionResult> GetCourses([FromQuery] int facultyId)

        {
            try
            {
                var courses = await _authService.GetCourses(facultyId);
                return Ok(courses);
            }
            catch (Exception ex)
            {

                return NotFound(new { Error = ex.Message });
            }
        }


        [HttpGet("classes")]

        public async Task<IActionResult> GetClasses([FromQuery] int courseId)
        {
            var classes = await _authService.GetClasses(courseId);
            return Ok(classes);
        }

        [HttpGet("verify-token")]
        public async Task<IActionResult> VerifyToken()
        {
            var token = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { Error = "Token not found" });
            }
            try
            {
                var data = await _authService.VerifyToken(token);
                var user = new UserData(UserId: data.user.UserId, FullName: data.user.FullName, Role: data.user.Role);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
        }
        [HttpGet("get-user-id")]
        [Authorize]
        public async Task<IActionResult> GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { Error = "User ID not found in token" });
            }
            return Ok(new { UserId = userId });
        }
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> Profile()
        {
            var token = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { Error = "Token not found" });
            }
            try
            {
                var data = await _authService.Profile(token);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Error = ex.Message });

            }

        }
        [HttpGet("college-name")]
        public async Task<IActionResult> CollegeName(int collegeId)
        {
            var data = await _authService.CollegeName(collegeId);
            return Ok(data);
        }
        [HttpGet("faculty-name")]
        public async Task<IActionResult> FacultyName(int facultyId)
        {
            var data = await _authService.FacultyName(facultyId);
            return Ok(data);
        }
        [HttpGet("course-name")]
        public async Task<IActionResult> CourseName(int courseId)
        {
            var data = await _authService.CourseName(courseId);
            return Ok(data);
        }
        [HttpGet("class-name")]
        public async Task<IActionResult> ClassName(int classId)
        {
            var data = await _authService.ClassName(classId);
            return Ok(data);
        }
        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var token = Request.Cookies["jwt"];
            Console.WriteLine(token);
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { Error = "Token not found" });
            }
            var data = await _authService.UpdateProfile(token, request);
            return Ok(data);
        }
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { Message = "Logged out successfully" });
        }

        [HttpGet("teacher/stats")]
        [Authorize]
        public async Task<IActionResult> GetTeacherStats()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { Error = "User ID not found in token" });
                }

                var stats = await _authService.GetTeacherStats(userId);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserDetails()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (string.IsNullOrEmpty(cookie))
                {
                    return Unauthorized(new { Error = "Token not found" });
                }

                var userDetails = await _authService.GetUserDetails(cookie);
                return Ok(userDetails);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
        }
    }
}
