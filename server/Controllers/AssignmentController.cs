using Microsoft.AspNetCore.Mvc;
using Server.Services; // Ensure this is included
using Server.Models;
using Microsoft.AspNetCore.Authorization;
using Server.DTOs;
using Server.Token;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly AssignmentService _assignmentService; // Use concrete AuthService, not IAuthService

        public AssignmentController(AssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignmentById([FromRoute] int id)
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "teacher")
                {
                    return Unauthorized(new { Error = "You are not authorized to get this assignment" });
                }
                var assignment = await _assignmentService.GetAssignmentById(id);
                return Ok(assignment);
            }
            catch (System.Exception)
            {
                return BadRequest(new { Error = "Failed to get assignment" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentRequest assignment)
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "teacher")
                {
                    return Unauthorized(new { Error = "You are not authorized to create an assignment" });
                }
                var newAssignment = await _assignmentService.CreateAssignment(assignment, decodedToken.UserId);
                return Ok(newAssignment);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to create assignment: {ex.Message}" });
            }
        }

        [HttpGet("submission/{assignmentId}")]
        public async Task<IActionResult> GetSubmissionsByAssignmentId([FromRoute] int assignmentId)

        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }

                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "teacher")
                {
                    return Unauthorized(new { Error = "You are not authorized to get submissions" });
                }

                var submissions = await _assignmentService.GetSubmissionsByAssignmentId(assignmentId);
                return Ok(submissions); // submissions should be List<SubmissionWithRemarkDTO>
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get submissions: {ex.Message}" });
            }
        }



        [HttpGet("get/student")]
        public async Task<IActionResult> GetAllAssignmentsByStudentId()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "Student")
                {
                    return Unauthorized(new { Error = "You are not authorized to get all assignments" });
                }
                var assignments = await _assignmentService.GetAllAssignmentsByStudentId(decodedToken.UserId);
                return Ok(new { assignments });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get assignments: {ex.Message}" });
            }
        }

        [HttpGet("get/teacher")]
        public async Task<IActionResult> GetAllAssignmentsByTeacherId()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "teacher")
                {
                    return Unauthorized(new { Error = "You are not authorized to get all assignments" });
                }
                var assignments = await _assignmentService.GetAllAssignmentsByTeacherId(decodedToken.UserId);
                return Ok(new { assignments });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get assignments: {ex.Message}" });
            }
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetTeacherCourses()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "teacher")
                {
                    return Unauthorized(new { Error = "You are not authorized to get courses" });
                }
                var courses = await _assignmentService.GetCoursesByTeacherId(decodedToken.UserId);
                return Ok(new { courses });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get courses: {ex.Message}" });
            }
        }

        [HttpGet("classes/{courseId}")]
        public async Task<IActionResult> GetClassesByCourseId([FromRoute] int courseId)
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "teacher")
                {
                    return Unauthorized(new { Error = "You are not authorized to get classes" });
                }
                var classes = await _assignmentService.GetClassesByCourseId(courseId);
                return Ok(new { classes });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get classes: {ex.Message}" });
            }
        }

        [HttpGet("calendar")]
        public async Task<IActionResult> GetCalendarAssignments()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null)
                {
                    return Unauthorized(new { Error = "Invalid token" });
                }

                var assignments = await _assignmentService.GetCalendarAssignments(decodedToken.UserId);
                return Ok(new { assignments });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get calendar assignments: {ex.Message}" });
            }
        }

        [HttpGet("get/teacher/dashboard")]
        public async Task<IActionResult> GetTeacherDashboardAssignments()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "teacher")
                {
                    return Unauthorized(new { Error = "You are not authorized to get assignments" });
                }
                var assignments = await _assignmentService.GetTeacherDashboardAssignments(decodedToken.UserId);
                return Ok(new { assignments });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = $"Failed to get assignments: {ex.Message}" });
            }
        }

    }
}


