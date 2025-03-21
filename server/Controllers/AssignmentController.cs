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
                return Ok(submissions);
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
                if (decodedToken == null || decodedToken.Role != "student")
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
    }
}
