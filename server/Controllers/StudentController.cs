using Microsoft.AspNetCore.Mvc;
using Server.Services;
using Server.Models;
using Microsoft.AspNetCore.Authorization;
using Server.Token;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _studentService;

        public StudentController(StudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet("assignments")]
        public async Task<IActionResult> GetStudentAssignments()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }

                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "student")
                {
                    return Unauthorized(new { Error = "You are not authorized to view these assignments" });
                }

                var assignments = await _studentService.GetStudentAssignments(decodedToken.UserId);
                return Ok(new { assignments });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get assignments: {ex.Message}" });
            }
        }
    }
}